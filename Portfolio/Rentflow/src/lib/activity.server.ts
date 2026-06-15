export async function logActivity(input: {
  action: string;
  entity_type: string;
  entity_id?: string | null;
  actor_id?: string | null;
  meta?: Record<string, unknown>;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("activity_log").insert({
    action: input.action,
    entity_type: input.entity_type,
    entity_id: input.entity_id ?? null,
    actor_id: input.actor_id ?? null,
    meta: input.meta ?? {},
  });
}

export async function notifyUser(input: {
  user_id: string;
  title: string;
  body?: string;
  entity_type?: string;
  entity_id?: string;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("notifications").insert({
    user_id: input.user_id,
    title: input.title,
    body: input.body ?? null,
    entity_type: input.entity_type ?? null,
    entity_id: input.entity_id ?? null,
  });
}
