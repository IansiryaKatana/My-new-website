import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ApplicationListRow = {
  id: string;
  status: string;
  offer_amount: number;
  cheques_offered: number;
  move_in_date: string | null;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  property_id: string;
  properties: { id: string; title: string; community: string; cover_image: string | null } | null;
  profiles: { full_name: string | null; email: string | null; phone: string | null; avatar_url: string | null } | null;
};

export const listApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ApplicationListRow[]> => {
    const { data, error } = await context.supabase
      .from("applications")
      .select("id, status, offer_amount, cheques_offered, move_in_date, created_at, updated_at, tenant_id, property_id, properties(id,title,community,cover_image), profiles!applications_tenant_id_fkey(full_name,email,phone,avatar_url)")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ApplicationListRow[];
  });

export const getTenantApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("applications")
      .select("*, properties(id,title,community,building,unit_no,cover_image,rent_yearly)")
      .eq("id", data.id)
      .eq("tenant_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!app) throw new Error("Not found");
    const { data: docs } = await context.supabase
      .from("application_documents")
      .select("*")
      .eq("application_id", data.id)
      .order("created_at");
    return { ...app, documents: docs ?? [] };
  });

export const withdrawApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("applications")
      .update({ status: "withdrawn" as never })
      .eq("id", data.id)
      .eq("tenant_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const assignApplicationAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), agent_id: z.string().uuid().nullable() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("applications")
      .update({ agent_id: data.agent_id })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: app, error } = await supabase
      .from("applications")
      .select("*, properties(id,title,community,building,unit_no,cover_image,rent_yearly), profiles!applications_tenant_id_fkey(id,full_name,email,phone,emirates_id,avatar_url,nationality)")
      .eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!app) throw new Error("Not found");
    const { data: docs } = await supabase
      .from("application_documents").select("*").eq("application_id", data.id).order("created_at");
    return { ...app, documents: docs ?? [] };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: string; rejection_reason?: string }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["submitted", "docs_review", "contract_sent", "approved", "rejected", "withdrawn"]),
      rejection_reason: z.string().max(500).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("applications")
      .update({ status: data.status as never, rejection_reason: data.rejection_reason ?? null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    try {
      const { sendTemplatedEmailForApplication } = await import("@/lib/communications.functions");
      await sendTemplatedEmailForApplication("application_status", data.id);
    } catch {
      // Email is best-effort when Resend is configured
    }

    return { ok: true };
  });

export const verifyDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; verified: boolean }) =>
    z.object({ id: z.string().uuid(), verified: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("application_documents")
      .update({ verified: data.verified, verified_by: context.userId, verified_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const ApplyInput = z.object({
  property_id: z.string().uuid(),
  offer_amount: z.number().positive(),
  cheques_offered: z.number().int().min(1).max(12),
  move_in_date: z.string().nullable().optional(),
  occupants: z.number().int().min(1).max(20),
  employer: z.string().max(200).nullable().optional(),
  monthly_income: z.number().min(0).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const submitApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ApplyInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase.from("applications")
      .insert({ ...data, tenant_id: userId, status: "submitted" }).select("id").single();
    if (error) throw new Error(error.message);

    try {
      const { sendTemplatedEmailForApplication } = await import("@/lib/communications.functions");
      await sendTemplatedEmailForApplication("application_received", row.id);
    } catch {
      // Email is best-effort when Resend is configured
    }

    return { id: row.id };
  });

export const addApplicationDocument = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { application_id: string; doc_type: string; file_path: string; file_name: string }) =>
    z.object({
      application_id: z.string().uuid(),
      doc_type: z.enum(["emirates_id", "passport", "visa", "salary_certificate", "bank_statement", "trade_license", "other"]),
      file_path: z.string().max(500),
      file_name: z.string().max(200),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("application_documents").insert({
      application_id: data.application_id,
      doc_type: data.doc_type as never,
      file_path: data.file_path,
      file_name: data.file_name,
      uploaded_by: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
