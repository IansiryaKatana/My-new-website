-- Notifications, team role management, enriched tenant RPCs

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  entity_type TEXT,
  entity_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, read_at) WHERE read_at IS NULL;

GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users mark own notifications read" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff insert notifications" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
CREATE POLICY "Owners manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE OR REPLACE FUNCTION public.get_tenant_journey(_tenancy_id UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE t RECORD;
BEGIN
  SELECT * INTO t FROM tenancies WHERE id = _tenancy_id;
  IF t IS NULL THEN RAISE EXCEPTION 'Tenancy not found'; END IF;
  IF NOT (public.is_staff(auth.uid()) OR t.tenant_id = auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;

  RETURN jsonb_build_object(
    'tenancy', to_jsonb(t),
    'tenant', (SELECT to_jsonb(pr) FROM profiles pr WHERE pr.id = t.tenant_id),
    'property', (SELECT to_jsonb(p) FROM properties p WHERE p.id = t.property_id),
    'payments', (SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p.due_date), '[]'::jsonb) FROM payments p WHERE p.tenancy_id = _tenancy_id),
    'tickets', (SELECT COALESCE(jsonb_agg(to_jsonb(m) ORDER BY m.created_at DESC), '[]'::jsonb) FROM maintenance_tickets m WHERE m.tenancy_id = _tenancy_id),
    'renewals', (SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.created_at DESC), '[]'::jsonb) FROM renewals r WHERE r.tenancy_id = _tenancy_id),
    'complaints', (SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY c.created_at DESC), '[]'::jsonb) FROM complaints c WHERE c.tenancy_id = _tenancy_id)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_tenant_home()
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN jsonb_build_object(
    'profile', (SELECT to_jsonb(pr) FROM profiles pr WHERE pr.id = uid),
    'tenancies', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', t.id, 'status', t.status, 'start_date', t.start_date, 'end_date', t.end_date,
        'annual_rent', t.annual_rent, 'cheques', t.cheques, 'ejari_number', t.ejari_number, 'contract_url', t.contract_url,
        'property', jsonb_build_object('id',p.id,'title',p.title,'community',p.community,'building',p.building,'unit_no',p.unit_no,'cover_image',p.cover_image)
      ) ORDER BY t.start_date DESC), '[]'::jsonb)
      FROM tenancies t JOIN properties p ON p.id = t.property_id WHERE t.tenant_id = uid
    ),
    'applications', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', a.id, 'status', a.status, 'created_at', a.created_at, 'offer_amount', a.offer_amount,
        'rejection_reason', a.rejection_reason, 'contract_url', a.contract_url,
        'property', jsonb_build_object('id',p.id,'title',p.title,'community',p.community,'cover_image',p.cover_image)
      ) ORDER BY a.created_at DESC), '[]'::jsonb)
      FROM applications a JOIN properties p ON p.id = a.property_id WHERE a.tenant_id = uid
    ),
    'viewings', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', v.id, 'status', v.status, 'scheduled_at', v.scheduled_at, 'notes', v.notes,
        'property', jsonb_build_object('id',p.id,'title',p.title,'community',p.community,'cover_image',p.cover_image)
      ) ORDER BY COALESCE(v.scheduled_at, v.created_at) DESC), '[]'::jsonb)
      FROM viewings v JOIN properties p ON p.id = v.property_id WHERE v.tenant_id = uid
    ),
    'renewals', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', r.id, 'status', r.status, 'current_rent', r.current_rent, 'proposed_rent', r.proposed_rent,
        'proposed_cheques', r.proposed_cheques, 'notes', r.notes, 'offered_at', r.offered_at,
        'property_title', p.title
      ) ORDER BY r.created_at DESC), '[]'::jsonb)
      FROM renewals r
      JOIN tenancies t ON t.id = r.tenancy_id
      JOIN properties p ON p.id = t.property_id
      WHERE t.tenant_id = uid AND r.status = 'offered'
    ),
    'upcoming_payments', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', pay.id, 'due_date', pay.due_date, 'amount', pay.amount, 'status', pay.status,
        'payment_type', pay.payment_type, 'property_title', p.title, 'proof_url', pay.proof_url
      ) ORDER BY pay.due_date ASC), '[]'::jsonb)
      FROM payments pay JOIN tenancies t ON t.id = pay.tenancy_id JOIN properties p ON p.id = t.property_id
      WHERE t.tenant_id = uid AND pay.status IN ('scheduled','pending') AND pay.due_date <= current_date + interval '90 days'
    ),
    'payment_history', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', pay.id, 'due_date', pay.due_date, 'amount', pay.amount, 'status', pay.status,
        'payment_type', pay.payment_type, 'property_title', p.title, 'paid_at', pay.paid_at
      ) ORDER BY pay.due_date DESC), '[]'::jsonb)
      FROM payments pay JOIN tenancies t ON t.id = pay.tenancy_id JOIN properties p ON p.id = t.property_id
      WHERE t.tenant_id = uid
      LIMIT 50
    ),
    'open_tickets', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', mt.id, 'subject', mt.subject, 'status', mt.status, 'priority', mt.priority, 'created_at', mt.created_at
      ) ORDER BY mt.created_at DESC), '[]'::jsonb)
      FROM maintenance_tickets mt JOIN tenancies t ON t.id = mt.tenancy_id
      WHERE t.tenant_id = uid AND mt.status IN ('open','in_progress','awaiting_tenant')
    ),
    'complaints', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', c.id, 'subject', c.subject, 'status', c.status, 'severity', c.severity, 'created_at', c.created_at
      ) ORDER BY c.created_at DESC), '[]'::jsonb)
      FROM complaints c JOIN tenancies t ON t.id = c.tenancy_id
      WHERE t.tenant_id = uid
    )
  );
END;
$$;

NOTIFY pgrst, 'reload schema';
