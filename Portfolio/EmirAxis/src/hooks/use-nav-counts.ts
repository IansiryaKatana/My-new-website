import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Lightweight counts to drive sidebar badges. */
export function useNavCounts() {
  return useQuery({
    queryKey: ["nav-counts"],
    refetchInterval: 60_000,
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [openJobs, pendingLeave, draftTimesheets, overdueInvoices, openIssues] = await Promise.all([
        supabase.from("job_orders").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress", "partially_filled"]),
        supabase.from("leave_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("timesheets").select("id", { count: "exact", head: true }).in("status", ["draft", "submitted"]),
        supabase.from("invoices").select("id", { count: "exact", head: true }).lt("due_date", today).in("status", ["sent", "partial", "overdue"]),
        supabase.from("issues").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
      ]);
      return {
        "/job-orders": openJobs.count ?? 0,
        "/leave-approvals": pendingLeave.count ?? 0,
        "/timesheets": draftTimesheets.count ?? 0,
        "/invoices": overdueInvoices.count ?? 0,
        "/issues": openIssues.count ?? 0,
      } as Record<string, number>;
    },
  });
}
