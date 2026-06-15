import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type TenancyListRow = {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  annual_rent: number;
  cheques: number;
  ejari_number: string | null;
  property_id: string;
  tenant_id: string;
  properties: { id: string; title: string; community: string; building: string | null; unit_no: string | null; cover_image: string | null } | null;
  profiles: { full_name: string | null; phone: string | null; email: string | null; avatar_url: string | null } | null;
};

export const listTenancies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TenancyListRow[]> => {
    const { data, error } = await context.supabase
      .from("tenancies")
      .select("id, status, start_date, end_date, annual_rent, cheques, ejari_number, property_id, tenant_id, application_id, properties(id,title,community,building,unit_no,cover_image), profiles!tenancies_tenant_id_fkey(id,full_name,phone,email,avatar_url,emirates_id,nationality)")
      .order("start_date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as TenancyListRow[];
  });

export const getTenancyJourney = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("get_tenant_journey", { _tenancy_id: data.id });
    if (error) throw new Error(error.message);
    if (!result) return null;

    const tenancy = result.tenancy as { application_id?: string | null; tenant_id?: string } | undefined;
    let documents: Array<Record<string, unknown>> = [];
    let applications: Array<Record<string, unknown>> = [];

    if (tenancy?.application_id) {
      const { data: docs } = await context.supabase
        .from("application_documents")
        .select("id, doc_type, file_path, file_name, verified, created_at")
        .eq("application_id", tenancy.application_id)
        .order("created_at");
      documents = docs ?? [];
    }

    if (tenancy?.tenant_id) {
      const { data: apps } = await context.supabase
        .from("applications")
        .select("id, status, offer_amount, created_at, properties(title,community)")
        .eq("tenant_id", tenancy.tenant_id)
        .order("created_at", { ascending: false });
      applications = apps ?? [];
    }

    return { ...result, documents, applications };
  });

const CreateTenancyInput = z.object({
  property_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  application_id: z.string().uuid().nullable().optional(),
  start_date: z.string(),
  end_date: z.string(),
  annual_rent: z.number().positive(),
  cheques: z.number().int().min(1).max(12),
  security_deposit: z.number().min(0),
  ejari_number: z.string().max(80).nullable().optional(),
});

export const createTenancy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => CreateTenancyInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: t, error } = await supabase.from("tenancies").insert({ ...data, status: "upcoming" }).select("id").single();
    if (error) throw new Error(error.message);
    // Mark property rented
    await supabase.from("properties").update({ status: "rented" as never }).eq("id", data.property_id);
    // Generate cheque schedule
    await supabase.rpc("generate_payment_schedule", { _tenancy_id: t.id });
    return { id: t.id };
  });

export const updateTenancy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status?: string; ejari_number?: string | null; contract_url?: string | null }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["upcoming", "active", "notice_given", "ended", "terminated"]).optional(),
      ejari_number: z.string().max(80).nullable().optional(),
      contract_url: z.string().max(500).nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("tenancies").update(patch as never).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
