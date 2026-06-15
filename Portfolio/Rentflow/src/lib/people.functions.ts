import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PersonProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  emirates_id: string | null;
  nationality: string | null;
  created_at: string;
};

export type PersonApplication = {
  id: string;
  status: string;
  offer_amount: number;
  cheques_offered: number;
  move_in_date: string | null;
  created_at: string;
  property: { id: string; title: string; community: string; cover_image: string | null } | null;
  documents: Array<{
    id: string;
    doc_type: string;
    file_path: string;
    file_name: string | null;
    verified: boolean;
    created_at: string;
  }>;
};

export type PersonTenancy = {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  annual_rent: number;
  cheques: number;
  ejari_number: string | null;
  ejari_status: string | null;
  contract_url: string | null;
  application_id: string | null;
  property: { id: string; title: string; community: string; building: string | null; unit_no: string | null } | null;
};

export type Person360 = {
  profile: PersonProfile;
  roles: string[];
  applications: PersonApplication[];
  tenancies: PersonTenancy[];
};

export const getPerson360 = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<Person360> => {
    const { supabase } = context;

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, avatar_url, emirates_id, nationality, created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (profileErr) throw new Error(profileErr.message);
    if (!profile) throw new Error("Person not found");

    const [{ data: roles }, { data: applications }, { data: tenancies }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", data.id),
      supabase
        .from("applications")
        .select("id, status, offer_amount, cheques_offered, move_in_date, created_at, properties(id,title,community,cover_image)")
        .eq("tenant_id", data.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("tenancies")
        .select("id, status, start_date, end_date, annual_rent, cheques, ejari_number, ejari_status, contract_url, application_id, properties(id,title,community,building,unit_no)")
        .eq("tenant_id", data.id)
        .order("start_date", { ascending: false }),
    ]);

    const appIds = (applications ?? []).map((a) => a.id);
    let docsByApp = new Map<string, PersonApplication["documents"]>();
    if (appIds.length > 0) {
      const { data: allDocs } = await supabase
        .from("application_documents")
        .select("id, application_id, doc_type, file_path, file_name, verified, created_at")
        .in("application_id", appIds)
        .order("created_at");
      for (const doc of allDocs ?? []) {
        const list = docsByApp.get(doc.application_id) ?? [];
        list.push(doc);
        docsByApp.set(doc.application_id, list);
      }
    }

    return {
      profile: profile as PersonProfile,
      roles: (roles ?? []).map((r) => r.role),
      applications: (applications ?? []).map((a) => {
        const prop = a.properties as PersonApplication["property"];
        return {
          id: a.id,
          status: a.status,
          offer_amount: Number(a.offer_amount),
          cheques_offered: a.cheques_offered,
          move_in_date: a.move_in_date,
          created_at: a.created_at,
          property: prop,
          documents: docsByApp.get(a.id) ?? [],
        };
      }),
      tenancies: (tenancies ?? []).map((t) => {
        const prop = t.properties as PersonTenancy["property"];
        return {
          id: t.id,
          status: t.status,
          start_date: t.start_date,
          end_date: t.end_date,
          annual_rent: Number(t.annual_rent),
          cheques: t.cheques,
          ejari_number: t.ejari_number,
          ejari_status: t.ejari_status,
          contract_url: t.contract_url,
          application_id: t.application_id,
          property: prop,
        };
      }),
    };
  });
