import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DashboardOverview = {
  active_tenancies: number;
  upcoming_tenancies: number;
  available_listings: number;
  total_listings: number;
  occupancy_pct: number;
  open_viewings: number;
  pending_applications: number;
  open_tickets: number;
  mtd_collected: number;
  mtd_due: number;
  overdue_amount: number;
  overdue_count: number;
  renewals_due_60d: number;
};

export type FunnelData = {
  inquiries_30d: number;
  viewings_30d: number;
  applications_30d: number;
  approved_30d: number;
  tenancies_30d: number;
  pipeline: { submitted: number; docs_review: number; contract_sent: number; approved: number };
};

export type ActionItem = {
  kind: string;
  entity_id: string;
  label: string;
  sublabel: string | null;
  urgency: string;
  created_at: string;
};

export const getDashboardOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_dashboard_overview");
    if (error) throw new Error(error.message);
    return data as unknown as DashboardOverview;
  });

export const getRentalFunnel = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_rental_funnel");
    if (error) throw new Error(error.message);
    return data as unknown as FunnelData;
  });

export const getActionQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_action_queue");
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ActionItem[];
  });

export const getPaymentSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_payment_summary");
    if (error) throw new Error(error.message);
    return data as unknown as Record<string, number>;
  });

export const getListingAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("get_listing_analytics");
    if (error) throw new Error(error.message);
    return data as unknown as {
      by_community: Array<{ community: string; listings: number; rented: number; viewings: number; applications: number; avg_rent: number }>;
      avg_time_to_lease_days: number;
    };
  });
