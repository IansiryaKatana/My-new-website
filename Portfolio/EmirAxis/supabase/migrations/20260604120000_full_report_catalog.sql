-- PRD §27 full report catalog — RPCs for operational, recruitment, payroll, finance, HR

-- ---------- OPERATIONAL ----------
CREATE OR REPLACE FUNCTION public.report_active_employees()
RETURNS TABLE(employee_code text, full_name text, nationality text, designation text, status text, joining_date date)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.employee_code, w.full_name, w.nationality, w.designation, w.status::text, w.joining_date
  FROM workers w WHERE w.status IN ('active','on_leave') ORDER BY w.full_name;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_by_client()
RETURNS TABLE(client_name text, active_placements bigint, workers bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT c.legal_name, COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active'),
    COUNT(DISTINCT p.worker_id) FILTER (WHERE p.status = 'active')
  FROM clients c
  LEFT JOIN placements p ON p.client_id = c.id
  GROUP BY c.id, c.legal_name ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_by_nationality()
RETURNS TABLE(nationality text, count bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT COALESCE(NULLIF(TRIM(nationality), ''), 'Unknown'), COUNT(*)::bigint
  FROM workers WHERE status IN ('active','on_leave','onboarding') GROUP BY 1 ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_by_visa_status()
RETURNS TABLE(visa_status text, count bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT CASE
    WHEN visa_expiry IS NULL THEN 'No visa on file'
    WHEN visa_expiry < CURRENT_DATE THEN 'Expired'
    WHEN visa_expiry <= CURRENT_DATE + 90 THEN 'Expiring (90d)'
    ELSE 'Valid'
  END, COUNT(*)::bigint
  FROM workers WHERE status NOT IN ('terminated','exited') GROUP BY 1 ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_by_accommodation()
RETURNS TABLE(accommodation_name text, occupants bigint, capacity bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT a.name, COUNT(ba.id) FILTER (WHERE ba.is_active),
    COALESCE(SUM(ar.capacity), 0)::bigint
  FROM accommodations a
  LEFT JOIN accommodation_rooms ar ON ar.accommodation_id = a.id
  LEFT JOIN bed_assignments ba ON ba.room_id = ar.id AND ba.is_active
  WHERE a.is_active GROUP BY a.id, a.name ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_by_site()
RETURNS TABLE(site text, client_name text, workers bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT COALESCE(NULLIF(TRIM(jo.location), ''), 'Unspecified'), c.legal_name, COUNT(DISTINCT p.worker_id)::bigint
  FROM placements p
  JOIN job_orders jo ON jo.id = p.job_order_id
  JOIN clients c ON c.id = p.client_id
  WHERE p.status = 'active'
  GROUP BY jo.location, c.legal_name ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_pending_documents()
RETURNS TABLE(employee_code text, full_name text, missing_items text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.employee_code, w.full_name,
    TRIM(BOTH ', ' FROM CONCAT_WS(', ',
      CASE WHEN w.passport_no IS NULL OR w.passport_no = '' THEN 'Passport number' END,
      CASE WHEN w.passport_expiry IS NULL THEN 'Passport expiry' END,
      CASE WHEN NOT EXISTS (SELECT 1 FROM documents d WHERE d.worker_id = w.id AND d.category = 'passport') THEN 'Passport scan' END,
      CASE WHEN NOT EXISTS (SELECT 1 FROM documents d WHERE d.worker_id = w.id AND d.category = 'visa') THEN 'Visa document' END
    ))
  FROM workers w
  WHERE w.status IN ('onboarding','active')
    AND (w.passport_no IS NULL OR w.passport_expiry IS NULL
      OR NOT EXISTS (SELECT 1 FROM documents d WHERE d.worker_id = w.id AND d.category IN ('passport','visa')))
  ORDER BY w.full_name;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_pending_medical()
RETURNS TABLE(employee_code text, full_name text, medical_status text, appointment_at timestamptz)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.employee_code, w.full_name, COALESCE(mr.status::text, 'No record'), mr.appointment_at
  FROM workers w
  LEFT JOIN LATERAL (
    SELECT status, appointment_at FROM medical_records WHERE worker_id = w.id ORDER BY created_at DESC LIMIT 1
  ) mr ON true
  WHERE w.status IN ('onboarding','active')
    AND (mr.status IS NULL OR mr.status NOT IN ('passed','certified'))
  ORDER BY w.full_name;
$$;

CREATE OR REPLACE FUNCTION public.report_absconding_workers()
RETURNS TABLE(employee_code text, full_name text, nationality text, last_client text, status text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.employee_code, w.full_name, w.nationality, c.legal_name, w.status::text
  FROM workers w
  LEFT JOIN LATERAL (
    SELECT cl.legal_name FROM placements p JOIN clients cl ON cl.id = p.client_id
    WHERE p.worker_id = w.id ORDER BY p.start_date DESC LIMIT 1
  ) c(legal_name) ON true
  WHERE w.status = 'absconded' ORDER BY w.updated_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_warnings_issued(_from date, _to date)
RETURNS TABLE(issued_at date, worker_name text, warning_type text, reason text, status text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT wl.issued_at::date, w.full_name, wl.warning_type::text, wl.reason, wl.status::text
  FROM warning_letters wl JOIN workers w ON w.id = wl.worker_id
  WHERE wl.status IN ('issued','acknowledged','closed')
    AND wl.issued_at::date BETWEEN _from AND _to ORDER BY wl.issued_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_issues_by_client()
RETURNS TABLE(client_name text, open_issues bigint, critical bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT COALESCE(c.legal_name, 'Unassigned'), COUNT(*)::bigint,
    COUNT(*) FILTER (WHERE i.severity = 'critical')::bigint
  FROM issues i LEFT JOIN clients c ON c.id = i.client_id
  WHERE i.status IN ('open','in_progress') GROUP BY c.legal_name ORDER BY 2 DESC;
$$;

-- ---------- RECRUITMENT ----------
CREATE OR REPLACE FUNCTION public.report_recruitment_conversion()
RETURNS TABLE(stage text, count bigint, pct_of_total numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  WITH totals AS (SELECT COUNT(*)::numeric AS t FROM candidates)
  SELECT status::text, COUNT(*)::bigint,
    CASE WHEN (SELECT t FROM totals) = 0 THEN 0 ELSE ROUND(100.0 * COUNT(*) / (SELECT t FROM totals), 1) END
  FROM candidates GROUP BY status ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_candidate_rejections()
RETURNS TABLE(source text, count bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT COALESCE(NULLIF(TRIM(source), ''), 'Unknown'), COUNT(*)::bigint
  FROM candidates WHERE status IN ('rejected','withdrawn','blacklisted') GROUP BY 1 ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_time_to_deploy()
RETURNS TABLE(metric text, avg_days numeric, sample_size bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT 'Applicant → Worker', ROUND(AVG(w.joining_date - c.created_at::date)::numeric, 1),
    COUNT(*)::bigint
  FROM workers w JOIN candidates c ON c.id = w.candidate_id
  WHERE w.joining_date IS NOT NULL AND c.created_at IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.report_agent_performance()
RETURNS TABLE(agent_name text, submitted bigint, hired bigint, conversion_pct numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT ra.name, COUNT(c.id)::bigint, COUNT(c.id) FILTER (WHERE c.status = 'hired')::bigint,
    CASE WHEN COUNT(c.id) = 0 THEN 0 ELSE ROUND(100.0 * COUNT(c.id) FILTER (WHERE c.status = 'hired') / COUNT(c.id), 1) END
  FROM recruitment_agents ra
  LEFT JOIN candidates c ON c.agent_id = ra.id
  WHERE ra.is_active GROUP BY ra.id, ra.name ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_cost_per_hire()
RETURNS TABLE(agent_name text, hires bigint, commission_pct numeric, est_cost numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT ra.name, COUNT(c.id) FILTER (WHERE c.status = 'hired')::bigint, ra.commission_pct,
    ROUND(COUNT(c.id) FILTER (WHERE c.status = 'hired') * COALESCE(ra.commission_pct, 0) * 100, 2)
  FROM recruitment_agents ra LEFT JOIN candidates c ON c.agent_id = ra.id
  GROUP BY ra.id, ra.name, ra.commission_pct ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_open_job_orders()
RETURNS TABLE(reference text, client_name text, title text, quantity int, filled_count int, gap int, status text, priority text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT jo.reference, c.legal_name, jo.title, jo.quantity, jo.filled_count,
    GREATEST(0, jo.quantity - jo.filled_count), jo.status::text, jo.priority::text
  FROM job_orders jo JOIN clients c ON c.id = jo.client_id
  WHERE jo.status IN ('draft','open','in_progress','partially_filled','on_hold')
    AND jo.filled_count < jo.quantity
  ORDER BY jo.priority DESC, GREATEST(0, jo.quantity - jo.filled_count) DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_job_order_fulfilment()
RETURNS TABLE(reference text, client_name text, quantity int, filled_count int, fulfilment_pct numeric, status text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT jo.reference, c.legal_name, jo.quantity, jo.filled_count,
    CASE WHEN jo.quantity = 0 THEN 0 ELSE ROUND(100.0 * jo.filled_count / jo.quantity, 1) END,
    jo.status::text
  FROM job_orders jo JOIN clients c ON c.id = jo.client_id
  WHERE jo.status NOT IN ('cancelled')
  ORDER BY CASE WHEN jo.quantity = 0 THEN 0 ELSE ROUND(100.0 * jo.filled_count / jo.quantity, 1) END ASC;
$$;

-- ---------- PAYROLL ----------
CREATE OR REPLACE FUNCTION public.report_payroll_monthly_summary(_year int, _month int)
RETURNS TABLE(metric text, amount numeric, workers bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT 'Gross', pr.total_gross, pr.worker_count::bigint FROM payroll_runs pr
  WHERE pr.period_year = _year AND pr.period_month = _month
  UNION ALL
  SELECT 'Deductions', pr.total_deductions, pr.worker_count::bigint FROM payroll_runs pr
  WHERE pr.period_year = _year AND pr.period_month = _month
  UNION ALL
  SELECT 'Net', pr.total_net, pr.worker_count::bigint FROM payroll_runs pr
  WHERE pr.period_year = _year AND pr.period_month = _month;
$$;

CREATE OR REPLACE FUNCTION public.report_salary_advances(_from date, _to date)
RETURNS TABLE(worker_name text, amount numeric, status text, requested_at date)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, sa.amount, sa.status::text, sa.requested_at::date
  FROM salary_advances sa JOIN workers w ON w.id = sa.worker_id
  WHERE sa.requested_at::date BETWEEN _from AND _to ORDER BY sa.requested_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_deductions(_from date, _to date)
RETURNS TABLE(worker_name text, deduction_type text, amount numeric, description text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, wd.deduction_type::text, wd.amount, wd.description
  FROM worker_deductions wd JOIN workers w ON w.id = wd.worker_id
  WHERE wd.created_at::date BETWEEN _from AND _to ORDER BY wd.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_overtime(_from date, _to date)
RETURNS TABLE(worker_name text, period text, overtime_hours numeric, total_hours numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, ts.period_start::text || ' – ' || ts.period_end::text,
    ts.overtime_hours, ts.total_hours
  FROM timesheets ts JOIN workers w ON w.id = ts.worker_id
  WHERE ts.period_start >= _from AND ts.period_end <= _to AND ts.overtime_hours > 0
  ORDER BY ts.overtime_hours DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_payroll_exceptions()
RETURNS TABLE(employee_code text, full_name text, issue text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.employee_code, w.full_name, 'Missing IBAN / WPS ID'
  FROM workers w WHERE w.status = 'active' AND (w.iban IS NULL OR w.iban = '' OR w.wps_personal_id IS NULL)
  UNION ALL
  SELECT w.employee_code, w.full_name, 'Payslip draft past period'
  FROM payslips ps JOIN workers w ON w.id = ps.worker_id
  WHERE ps.status = 'draft' AND make_date(ps.period_year, ps.period_month, 1) < date_trunc('month', CURRENT_DATE)::date;
$$;

CREATE OR REPLACE FUNCTION public.report_workers_without_bank()
RETURNS TABLE(employee_code text, full_name text, bank_name text, iban text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT employee_code, full_name, bank_name, iban FROM workers
  WHERE status = 'active' AND (iban IS NULL OR iban = '') ORDER BY full_name;
$$;

CREATE OR REPLACE FUNCTION public.report_client_salary_cost(_from date, _to date)
RETURNS TABLE(client_name text, total_cost numeric, total_hours numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT c.legal_name, COALESCE(SUM(ts.total_hours * COALESCE(p.pay_rate, 0)), 0),
    COALESCE(SUM(ts.total_hours), 0)
  FROM clients c
  LEFT JOIN placements p ON p.client_id = c.id
  LEFT JOIN timesheets ts ON ts.placement_id = p.id AND ts.status = 'approved'
    AND ts.period_start >= _from AND ts.period_end <= _to
  GROUP BY c.id, c.legal_name ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_wps_export_status()
RETURNS TABLE(period text, status text, worker_count int, exported_at timestamptz)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT period_year::text || '-' || lpad(period_month::text, 2, '0'), status::text, worker_count, sif_exported_at
  FROM payroll_runs ORDER BY period_year DESC, period_month DESC LIMIT 24;
$$;

-- ---------- FINANCE ----------
CREATE OR REPLACE FUNCTION public.report_profit_by_worker(_from date, _to date)
RETURNS TABLE(worker_name text, employee_code text, revenue numeric, cost numeric, margin numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, w.employee_code,
    COALESCE(SUM(ts.total_hours * COALESCE(p.bill_rate, 0)), 0),
    COALESCE(SUM(ts.total_hours * COALESCE(p.pay_rate, 0)), 0),
    COALESCE(SUM(ts.total_hours * (COALESCE(p.bill_rate, 0) - COALESCE(p.pay_rate, 0))), 0)
  FROM workers w
  LEFT JOIN timesheets ts ON ts.worker_id = w.id AND ts.status = 'approved'
    AND ts.period_start >= _from AND ts.period_end <= _to
  LEFT JOIN placements p ON p.id = ts.placement_id
  GROUP BY w.id, w.full_name, w.employee_code
  HAVING COALESCE(SUM(ts.total_hours), 0) > 0 ORDER BY 5 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_outstanding_invoices()
RETURNS TABLE(reference text, client_name text, total numeric, amount_paid numeric, balance numeric, status text, due_date date)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT i.reference, c.legal_name, i.total, i.amount_paid, i.total - i.amount_paid, i.status::text, i.due_date
  FROM invoices i JOIN clients c ON c.id = i.client_id
  WHERE i.status IN ('sent','partial','overdue') AND i.total > i.amount_paid ORDER BY i.due_date NULLS LAST;
$$;

CREATE OR REPLACE FUNCTION public.report_overdue_clients()
RETURNS TABLE(client_name text, overdue_invoices bigint, total_overdue numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT c.legal_name, COUNT(*)::bigint, COALESCE(SUM(i.total - i.amount_paid), 0)
  FROM invoices i JOIN clients c ON c.id = i.client_id
  WHERE i.due_date < CURRENT_DATE AND i.status IN ('sent','partial','overdue') AND i.total > i.amount_paid
  GROUP BY c.id, c.legal_name ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_visa_costs(_from date, _to date)
RETURNS TABLE(worker_name text, stage text, cost numeric, completed_date date)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, vr.stage::text, vr.cost, vr.completed_date
  FROM visa_records vr JOIN workers w ON w.id = vr.worker_id
  WHERE COALESCE(vr.completed_date, vr.created_at::date) BETWEEN _from AND _to AND vr.cost > 0
  ORDER BY vr.cost DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_accommodation_costs()
RETURNS TABLE(accommodation_name text, monthly_rent numeric, active_beds bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT a.name, a.monthly_rent, COUNT(ba.id) FILTER (WHERE ba.is_active)::bigint
  FROM accommodations a
  LEFT JOIN accommodation_rooms ar ON ar.accommodation_id = a.id
  LEFT JOIN bed_assignments ba ON ba.room_id = ar.id
  WHERE a.is_active GROUP BY a.id, a.name ORDER BY a.monthly_rent DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_transport_summary()
RETURNS TABLE(metric text, count bigint)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT 'Active vehicles', COUNT(*)::bigint FROM vehicles WHERE is_active
  UNION ALL SELECT 'Active drivers', COUNT(*)::bigint FROM drivers WHERE is_active
  UNION ALL SELECT 'Active routes', COUNT(*)::bigint FROM transport_routes WHERE is_active;
$$;

CREATE OR REPLACE FUNCTION public.report_uniform_costs()
RETURNS TABLE(category text, items_issued bigint, total_deductions numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT COALESCE(category, 'Uncategorized'), COUNT(*)::bigint, COALESCE(SUM(deduction_amount), 0)
  FROM asset_issuances WHERE status = 'issued' GROUP BY category ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_margin_by_month(_from date, _to date)
RETURNS TABLE(month_label text, revenue numeric, cost numeric, margin numeric, margin_pct numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT to_char(date_trunc('month', ts.period_start), 'YYYY-MM'),
    COALESCE(SUM(ts.total_hours * COALESCE(p.bill_rate, 0)), 0),
    COALESCE(SUM(ts.total_hours * COALESCE(p.pay_rate, 0)), 0),
    COALESCE(SUM(ts.total_hours * (COALESCE(p.bill_rate, 0) - COALESCE(p.pay_rate, 0))), 0),
    CASE WHEN COALESCE(SUM(ts.total_hours * COALESCE(p.bill_rate, 0)), 0) = 0 THEN 0
      ELSE ROUND(100.0 * COALESCE(SUM(ts.total_hours * (COALESCE(p.bill_rate,0)-COALESCE(p.pay_rate,0))),0)
        / NULLIF(SUM(ts.total_hours * COALESCE(p.bill_rate,0)),0), 1) END
  FROM timesheets ts LEFT JOIN placements p ON p.id = ts.placement_id
  WHERE ts.status = 'approved' AND ts.period_start >= _from AND ts.period_end <= _to
  GROUP BY 1 ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.report_margin_trend(_months int DEFAULT 12)
RETURNS TABLE(month_label text, margin numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT to_char(m, 'YYYY-MM'),
    COALESCE(SUM(ts.total_hours * (COALESCE(p.bill_rate, 0) - COALESCE(p.pay_rate, 0))), 0)
  FROM generate_series(
    date_trunc('month', CURRENT_DATE) - ((_months - 1) || ' months')::interval,
    date_trunc('month', CURRENT_DATE), '1 month'::interval
  ) m
  LEFT JOIN timesheets ts ON date_trunc('month', ts.period_start) = m AND ts.status = 'approved'
  LEFT JOIN placements p ON p.id = ts.placement_id
  GROUP BY m ORDER BY m;
$$;

-- ---------- HR ----------
CREATE OR REPLACE FUNCTION public.report_warnings_by_worker()
RETURNS TABLE(worker_name text, employee_code text, warning_count bigint, latest_type text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, w.employee_code, COUNT(wl.id)::bigint,
    (ARRAY_AGG(wl.warning_type::text ORDER BY wl.issued_at DESC NULLS LAST))[1]
  FROM warning_letters wl JOIN workers w ON w.id = wl.worker_id
  WHERE wl.status IN ('issued','acknowledged','closed')
  GROUP BY w.id, w.full_name, w.employee_code ORDER BY 3 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_absence_rate(_from date, _to date)
RETURNS TABLE(worker_name text, days_recorded bigint, absent_days bigint, absence_pct numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.full_name, COUNT(a.id)::bigint, COUNT(a.id) FILTER (WHERE a.status = 'absent')::bigint,
    CASE WHEN COUNT(a.id) = 0 THEN 0 ELSE ROUND(100.0 * COUNT(a.id) FILTER (WHERE a.status = 'absent') / COUNT(a.id), 1) END
  FROM attendance a JOIN workers w ON w.id = a.worker_id
  WHERE a.date BETWEEN _from AND _to GROUP BY w.id, w.full_name HAVING COUNT(a.id) > 0 ORDER BY 4 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_attendance_summary(_from date, _to date)
RETURNS TABLE(status text, count bigint, pct numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  WITH c AS (SELECT COUNT(*)::numeric t FROM attendance WHERE date BETWEEN _from AND _to)
  SELECT a.status::text, COUNT(*)::bigint,
    CASE WHEN (SELECT t FROM c) = 0 THEN 0 ELSE ROUND(100.0 * COUNT(*) / (SELECT t FROM c), 1) END
  FROM attendance a WHERE a.date BETWEEN _from AND _to GROUP BY a.status ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_turnover_rate(_from date, _to date)
RETURNS TABLE(metric text, count bigint, rate_pct numeric)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  WITH active AS (SELECT COUNT(*)::numeric a FROM workers WHERE status IN ('active','on_leave')),
  exited AS (SELECT COUNT(*)::numeric e FROM workers WHERE status IN ('terminated','exited','absconded')
    AND updated_at::date BETWEEN _from AND _to)
  SELECT 'Exits in period', (SELECT e::bigint FROM exited),
    CASE WHEN (SELECT a FROM active) = 0 THEN 0 ELSE ROUND(100.0 * (SELECT e FROM exited) / (SELECT a FROM active), 1) END;
$$;

CREATE OR REPLACE FUNCTION public.report_worker_exits(_from date, _to date)
RETURNS TABLE(employee_code text, full_name text, status text, exit_period date)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT employee_code, full_name, status::text, updated_at::date
  FROM workers WHERE status IN ('terminated','exited','absconded','suspended')
    AND updated_at::date BETWEEN _from AND _to ORDER BY updated_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.report_high_risk_workers()
RETURNS TABLE(employee_code text, full_name text, warnings bigint, open_issues bigint, visa_expiry date)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT w.employee_code, w.full_name,
    (SELECT COUNT(*) FROM warning_letters wl WHERE wl.worker_id = w.id AND wl.status IN ('issued','acknowledged')),
    (SELECT COUNT(*) FROM issues i WHERE i.worker_id = w.id AND i.status IN ('open','in_progress')),
    w.visa_expiry
  FROM workers w WHERE w.status IN ('active','suspended','on_leave')
    AND (
      (SELECT COUNT(*) FROM warning_letters wl WHERE wl.worker_id = w.id) >= 2
      OR w.status = 'absconded'
      OR w.visa_expiry < CURRENT_DATE + 30
      OR EXISTS (SELECT 1 FROM issues i WHERE i.worker_id = w.id AND i.severity = 'critical' AND i.status IN ('open','in_progress'))
    )
  ORDER BY 3 DESC;
$$;

-- Grants (no-arg functions)
GRANT EXECUTE ON FUNCTION public.report_active_employees() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_by_client() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_by_nationality() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_by_visa_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_by_accommodation() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_by_site() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_pending_documents() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_pending_medical() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_absconding_workers() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_issues_by_client() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_recruitment_conversion() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_candidate_rejections() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_time_to_deploy() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_agent_performance() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_cost_per_hire() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_open_job_orders() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_job_order_fulfilment() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_payroll_exceptions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_workers_without_bank() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_wps_export_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_outstanding_invoices() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_overdue_clients() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_accommodation_costs() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_transport_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_uniform_costs() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_warnings_by_worker() TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_high_risk_workers() TO authenticated;

GRANT EXECUTE ON FUNCTION public.report_warnings_issued(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_salary_advances(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_deductions(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_overtime(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_client_salary_cost(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_profit_by_worker(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_visa_costs(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_margin_by_month(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_margin_trend(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_absence_rate(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_attendance_summary(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_turnover_rate(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_worker_exits(date, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.report_payroll_monthly_summary(int, int) TO authenticated;
