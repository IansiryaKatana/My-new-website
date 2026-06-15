import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      full_name: z.string().min(1).max(120).optional(),
      phone: z.string().max(40).nullable().optional(),
      emirates_id: z.string().max(40).nullable().optional(),
      nationality: z.string().max(80).nullable().optional(),
      avatar_url: z.string().url().nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, string | null> = {};
    if (data.full_name !== undefined) patch.full_name = data.full_name;
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.emirates_id !== undefined) patch.emirates_id = data.emirates_id;
    if (data.nationality !== undefined) patch.nationality = data.nationality;
    if (data.avatar_url !== undefined) patch.avatar_url = data.avatar_url;
    const { error } = await context.supabase.from("profiles").update(patch).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
