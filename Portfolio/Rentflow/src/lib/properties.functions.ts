import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listPublicProperties = createServerFn({ method: "GET" })
  .inputValidator((d: { community?: string; type?: string; minBeds?: number; maxRent?: number } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("properties")
      .select("id, title, community, sub_community, building, property_type, beds, baths, sqft, rent_yearly, cheques_accepted, cover_image, available_from, furnished, status")
      .in("status", ["available", "reserved"])
      .order("created_at", { ascending: false })
      .limit(120);
    if (data.community) q = q.eq("community", data.community);
    if (data.type) q = q.eq("property_type", data.type as never);
    if (typeof data.minBeds === "number") q = q.gte("beds", data.minBeds);
    if (typeof data.maxRent === "number") q = q.lte("rent_yearly", data.maxRent);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getPublicProperty = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: prop, error } = await supabaseAdmin
      .from("properties").select("*").eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!prop) return null;
    const { data: images } = await supabaseAdmin
      .from("property_images").select("url, sort_order").eq("property_id", data.id).order("sort_order");
    return { ...prop, images: images ?? [] };
  });

export const getStaffProperty = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: prop, error } = await context.supabase
      .from("properties")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!prop) throw new Error("Property not found");

    const [{ data: images }, { data: apps }, { data: viewings }] = await Promise.all([
      context.supabase.from("property_images").select("id, url, sort_order").eq("property_id", data.id).order("sort_order"),
      context.supabase
        .from("applications")
        .select("id, status, offer_amount, created_at, profiles!applications_tenant_id_fkey(full_name)")
        .eq("property_id", data.id)
        .order("created_at", { ascending: false })
        .limit(10),
      context.supabase
        .from("viewings")
        .select("id, status, scheduled_at, requested_at, profiles!viewings_tenant_id_fkey(full_name)")
        .eq("property_id", data.id)
        .order("requested_at", { ascending: false })
        .limit(10),
    ]);

    return { ...prop, images: images ?? [], applications: apps ?? [], viewings: viewings ?? [] };
  });

export const listStaffProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("properties")
      .select("id, reference, title, community, building, unit_no, property_type, beds, rent_yearly, status, available_from, cover_image, view_count, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const PropertyInput = z.object({
  id: z.string().uuid().optional(),
  reference: z.string().max(40).nullable().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  community: z.string().min(1).max(120),
  sub_community: z.string().max(120).nullable().optional(),
  building: z.string().max(120).nullable().optional(),
  unit_no: z.string().max(40).nullable().optional(),
  property_type: z.enum(["apartment", "villa", "townhouse", "penthouse", "studio", "office", "retail"]),
  beds: z.number().min(0).max(20),
  baths: z.number().min(0).max(20),
  sqft: z.number().int().min(0).max(100000).nullable().optional(),
  rent_yearly: z.number().min(0).max(100000000),
  cheques_accepted: z.number().int().min(1).max(12),
  security_deposit: z.number().min(0).nullable().optional(),
  agency_fee: z.number().min(0).nullable().optional(),
  available_from: z.string().nullable().optional(),
  furnished: z.boolean(),
  amenities: z.array(z.string()).max(40),
  cover_image: z.string().max(2000).nullable().optional(),
  status: z.enum(["draft", "available", "reserved", "rented", "off_market"]),
});

export const upsertProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => PropertyInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const payload = { ...data, listed_by: userId };
    if (data.id) {
      const { error } = await supabase.from("properties").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await supabase.from("properties").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const addPropertyImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ property_id: z.string().uuid(), url: z.string().url(), sort_order: z.number().int().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("property_images")
      .insert({ property_id: data.property_id, url: data.url, sort_order: data.sort_order ?? 0 })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deletePropertyImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("property_images").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("properties").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
