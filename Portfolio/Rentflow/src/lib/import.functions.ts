import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PropertyRow = z.object({
  title: z.string().min(1),
  community: z.string().min(1),
  building: z.string().optional(),
  unit_no: z.string().optional(),
  property_type: z.enum(["apartment", "villa", "townhouse", "penthouse", "studio", "office", "retail"]).default("apartment"),
  beds: z.coerce.number().min(0).default(1),
  baths: z.coerce.number().min(0).default(1),
  sqft: z.coerce.number().optional(),
  rent_yearly: z.coerce.number().min(0),
  cheques_accepted: z.coerce.number().min(1).max(12).default(4),
  furnished: z.union([z.literal("true"), z.literal("false"), z.literal("yes"), z.literal("no"), z.literal("1"), z.literal("0")]).optional(),
  status: z.enum(["draft", "available", "reserved", "rented", "off_market"]).default("draft"),
  available_from: z.string().optional(),
  description: z.string().optional(),
});

export const importPropertiesCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ rows: z.array(z.record(z.string())) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    let imported = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      const raw = data.rows[i];
      const parsed = PropertyRow.safeParse({
        ...raw,
        furnished: raw.furnished?.toLowerCase(),
      });
      if (!parsed.success) {
        errors.push(`Row ${i + 2}: ${parsed.error.issues[0]?.message ?? "Invalid data"}`);
        continue;
      }
      const row = parsed.data;
      const furnished = ["true", "yes", "1"].includes(String(raw.furnished ?? "").toLowerCase());
      const { error } = await supabase.from("properties").insert({
        title: row.title.trim(),
        community: row.community.trim(),
        building: row.building?.trim() || null,
        unit_no: row.unit_no?.trim() || null,
        property_type: row.property_type,
        beds: row.beds,
        baths: row.baths,
        sqft: row.sqft ?? null,
        rent_yearly: row.rent_yearly,
        cheques_accepted: row.cheques_accepted,
        furnished,
        amenities: [],
        status: row.status,
        available_from: row.available_from || null,
        description: row.description?.trim() || null,
        listed_by: userId,
      });
      if (error) errors.push(`Row ${i + 2}: ${error.message}`);
      else imported++;
    }

    return { imported, errors };
  });

const TenancyRow = z.object({
  tenant_email: z.string().email(),
  property_title: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  annual_rent: z.coerce.number().positive(),
  cheques: z.coerce.number().min(1).max(12).default(4),
  security_deposit: z.coerce.number().min(0).optional(),
  ejari_number: z.string().optional(),
});

export const importTenanciesCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ rows: z.array(z.record(z.string())) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    let imported = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.rows.length; i++) {
      const parsed = TenancyRow.safeParse(data.rows[i]);
      if (!parsed.success) {
        errors.push(`Row ${i + 2}: ${parsed.error.issues[0]?.message ?? "Invalid data"}`);
        continue;
      }
      const row = parsed.data;

      const { data: profile } = await supabase.from("profiles").select("id").eq("email", row.tenant_email).maybeSingle();
      if (!profile) {
        errors.push(`Row ${i + 2}: Tenant not found (${row.tenant_email})`);
        continue;
      }

      const { data: property } = await supabase
        .from("properties")
        .select("id")
        .ilike("title", row.property_title.trim())
        .maybeSingle();
      if (!property) {
        errors.push(`Row ${i + 2}: Property not found (${row.property_title})`);
        continue;
      }

      const deposit = row.security_deposit ?? Math.round(row.annual_rent * 0.05);
      const { data: tenancy, error } = await supabase
        .from("tenancies")
        .insert({
          property_id: property.id,
          tenant_id: profile.id,
          start_date: row.start_date,
          end_date: row.end_date,
          annual_rent: row.annual_rent,
          cheques: row.cheques,
          security_deposit: deposit,
          ejari_number: row.ejari_number?.trim() || null,
          status: "upcoming",
        })
        .select("id")
        .single();

      if (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
        continue;
      }

      await supabase.from("properties").update({ status: "rented" as never }).eq("id", property.id);
      await supabase.rpc("generate_payment_schedule", { _tenancy_id: tenancy.id });
      imported++;
    }

    return { imported, errors };
  });

export const bulkDeleteProperties = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ ids: z.array(z.string().uuid()).min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("properties").delete().in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true, deleted: data.ids.length };
  });
