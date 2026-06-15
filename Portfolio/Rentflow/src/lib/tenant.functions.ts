import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type TenantHome = {
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
    emirates_id: string | null;
    nationality: string | null;
  } | null;
  tenancies: Array<{
    id: string;
    status: string;
    start_date: string;
    end_date: string;
    annual_rent: number;
    cheques: number;
    ejari_number: string | null;
    contract_url: string | null;
    property: {
      id: string;
      title: string;
      community: string;
      building: string | null;
      unit_no: string | null;
      cover_image: string | null;
    };
  }>;
  applications: Array<{
    id: string;
    status: string;
    created_at: string;
    offer_amount: number;
    rejection_reason: string | null;
    contract_url: string | null;
    property: { id: string; title: string; community: string; cover_image: string | null };
  }>;
  viewings: Array<{
    id: string;
    status: string;
    scheduled_at: string | null;
    notes: string | null;
    property: { id: string; title: string; community: string; cover_image: string | null };
  }>;
  renewals: Array<{
    id: string;
    status: string;
    current_rent: number;
    proposed_rent: number;
    proposed_cheques: number;
    notes: string | null;
    offered_at: string | null;
    property_title: string;
  }>;
  upcoming_payments: Array<{
    id: string;
    due_date: string;
    amount: number;
    status: string;
    payment_type: string;
    property_title: string;
    proof_url: string | null;
  }>;
  payment_history: Array<{
    id: string;
    due_date: string;
    amount: number;
    status: string;
    payment_type: string;
    property_title: string;
    paid_at: string | null;
  }>;
  open_tickets: Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    created_at: string;
  }>;
  complaints: Array<{
    id: string;
    subject: string;
    status: string;
    severity: string;
    created_at: string;
  }>;
};

export const getTenantHome = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TenantHome> => {
    const { data, error } = await context.supabase.rpc("get_tenant_home");
    if (error) throw new Error(error.message);
    return data as unknown as TenantHome;
  });
