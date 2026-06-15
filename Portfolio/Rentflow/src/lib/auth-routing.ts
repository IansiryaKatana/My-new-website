import { supabase } from "@/integrations/supabase/client";

export type AppRole = "owner" | "agent" | "tenant";

export const STAFF_ROUTE_PREFIXES = [
  "/dashboard",
  "/properties",
  "/applications",
  "/tenants",
  "/people",
  "/agents",
  "/payments",
  "/maintenance",
  "/renewals",
  "/viewings",
  "/complaints",
  "/settings",
] as const;

export const TENANT_ROUTE_PREFIXES = ["/portal"] as const;

export const OWNER_ONLY_PREFIXES = ["/settings"] as const;

export function isStaffRoute(pathname: string): boolean {
  return STAFF_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isTenantRoute(pathname: string): boolean {
  return TENANT_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isOwnerOnlyRoute(pathname: string): boolean {
  return OWNER_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function resolveUserRoles(userId: string): Promise<AppRole[]> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r) => r.role as AppRole);
}

export async function isUserStaff(userId: string): Promise<boolean> {
  const roles = await resolveUserRoles(userId);
  return roles.includes("owner") || roles.includes("agent");
}

export async function isUserOwner(userId: string): Promise<boolean> {
  const roles = await resolveUserRoles(userId);
  return roles.includes("owner");
}

export async function getPrimaryRole(userId: string): Promise<AppRole> {
  const roles = await resolveUserRoles(userId);
  if (roles.includes("owner")) return "owner";
  if (roles.includes("agent")) return "agent";
  return "tenant";
}

export async function getPostLoginPath(): Promise<"/dashboard" | "/portal"> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return "/portal";
  return (await isUserStaff(data.user.id)) ? "/dashboard" : "/portal";
}

export function getHomePathForRole(role: AppRole): "/dashboard" | "/portal" {
  return role === "tenant" ? "/portal" : "/dashboard";
}

export type StaffNavItem = {
  to:
    | "/dashboard"
    | "/properties"
    | "/applications"
    | "/viewings"
    | "/tenants"
    | "/agents"
    | "/payments"
    | "/maintenance"
    | "/renewals"
    | "/complaints"
    | "/settings";
  label: string;
};

export function getStaffNavItems(role: AppRole): StaffNavItem[] {
  const ops: StaffNavItem[] = [
    { to: "/dashboard", label: "Overview" },
    { to: "/properties", label: "Properties" },
    { to: "/applications", label: "Applications" },
    { to: "/viewings", label: "Viewings" },
    { to: "/tenants", label: "Tenants" },
    { to: "/agents", label: "Team" },
    { to: "/payments", label: "Payments" },
    { to: "/maintenance", label: "Maintenance" },
    { to: "/renewals", label: "Renewals" },
    { to: "/complaints", label: "Complaints" },
  ];

  if (role === "owner") {
    return [...ops, { to: "/settings", label: "Settings" }];
  }

  return ops;
}

export function actionQueueHref(kind: string, entityId: string): string {
  switch (kind) {
    case "viewing":
      return `/viewings?id=${entityId}`;
    case "application":
      return `/applications/${entityId}`;
    case "payment_overdue":
      return `/payments/${entityId}`;
    case "ticket":
      return `/maintenance/${entityId}`;
    default:
      return "/dashboard";
  }
}
