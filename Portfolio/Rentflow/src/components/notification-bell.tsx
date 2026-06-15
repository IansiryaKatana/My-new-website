import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { listNotifications, markNotificationsRead } from "@/lib/notifications.functions";
import { formatDate } from "@/lib/format";

export function NotificationBell() {
  const qc = useQueryClient();
  const fetch = useServerFn(listNotifications);
  const markRead = useServerFn(markNotificationsRead);
  const q = useQuery({ queryKey: ["notifications"], queryFn: () => fetch(), refetchInterval: 60_000 });

  const mut = useMutation({
    mutationFn: () => markRead({ data: {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = (q.data ?? []).filter((n) => !n.read_at).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Notifications
            {unread > 0 && (
              <Button size="sm" variant="ghost" onClick={() => mut.mutate()} disabled={mut.isPending}>
                Mark all read
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto">
          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : q.data && q.data.length > 0 ? (
            q.data.map((n) => (
              <div key={n.id} className={`rounded-lg border border-border p-3 text-sm ${n.read_at ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-foreground">{n.title}</div>
                  {!n.read_at && <StatusBadge status="new" label="New" />}
                </div>
                {n.body && <p className="mt-1 text-muted-foreground">{n.body}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
