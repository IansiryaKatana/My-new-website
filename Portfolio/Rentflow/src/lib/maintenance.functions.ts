import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type TicketListRow = {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string | null;
  created_at: string;
  resolved_at: string | null;
  tenancy_id: string;
  tenancies: {
    id: string;
    properties: { id: string; title: string; community: string; building: string | null; unit_no: string | null } | null;
    profiles: { full_name: string | null; phone: string | null } | null;
  } | null;
};

export const getTicket = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: ticket, error } = await context.supabase
      .from("maintenance_tickets")
      .select("*, tenancies(id, properties(id,title,community,building,unit_no), profiles!tenancies_tenant_id_fkey(full_name,email,phone))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ticket) throw new Error("Ticket not found");

    const { data: updates } = await context.supabase
      .from("maintenance_updates")
      .select("id, note, created_at, by_user, profiles:by_user(full_name)")
      .eq("ticket_id", data.id)
      .order("created_at", { ascending: true });

    return { ...ticket, updates: updates ?? [] };
  });

export const addMaintenanceUpdate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ ticket_id: z.string().uuid(), note: z.string().min(1).max(2000) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("maintenance_updates").insert({
      ticket_id: data.ticket_id,
      by_user: context.userId,
      note: data.note.trim(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TicketListRow[]> => {
    const { data, error } = await context.supabase
      .from("maintenance_tickets")
      .select("id, subject, category, priority, status, description, created_at, resolved_at, tenancy_id, tenancies(id, properties(id,title,community,building,unit_no), profiles!tenancies_tenant_id_fkey(full_name,phone))")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as TicketListRow[];
  });

const CreateTicketInput = z.object({
  tenancy_id: z.string().uuid(),
  subject: z.string().min(1).max(200),
  category: z.string().min(1).max(80),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().max(2000).nullable().optional(),
});

export const createTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => CreateTicketInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase.from("maintenance_tickets").insert(data).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status?: string; priority?: string; assigned_to?: string | null }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["open", "in_progress", "awaiting_tenant", "resolved", "closed"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      assigned_to: z.string().uuid().nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    if (patch.status === "resolved") (patch as Record<string, unknown>).resolved_at = new Date().toISOString();
    const { error } = await context.supabase.from("maintenance_tickets").update(patch as never).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
