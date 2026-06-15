import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  getPrimaryRole,
  isOwnerOnlyRoute,
  isStaffRoute,
  isTenantRoute,
  isUserStaff,
} from "@/lib/auth-routing";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const staff = await isUserStaff(data.user.id);
    const role = await getPrimaryRole(data.user.id);
    const path = location.pathname;

    if (isStaffRoute(path) && !staff) {
      throw redirect({ to: "/portal" });
    }

    if (isOwnerOnlyRoute(path) && role !== "owner") {
      throw redirect({ to: "/dashboard" });
    }

    if (isTenantRoute(path) && !staff && !path.startsWith("/portal")) {
      throw redirect({ to: "/portal" });
    }

    if ((path === "/dashboard" || path === "/") && !staff) {
      throw redirect({ to: "/portal" });
    }

    return { user: data.user, isStaff: staff, role };
  },
  component: () => <Outlet />,
});
