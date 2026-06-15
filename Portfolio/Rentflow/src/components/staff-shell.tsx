import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { type ReactNode, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import {
  LayoutDashboard,
  Home,
  ClipboardList,
  Wallet,
  Wrench,
  Users,
  Settings,
  LogOut,
  Repeat,
  CalendarDays,
  Menu,
  MessageSquareWarning,
  UserCog,
} from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth.functions";
import { getStaffNavItems, type AppRole, type StaffNavItem } from "@/lib/auth-routing";

const navIcons: Record<StaffNavItem["to"], ReactNode> = {
  "/dashboard": <LayoutDashboard className="h-4 w-4" />,
  "/properties": <Home className="h-4 w-4" />,
  "/applications": <ClipboardList className="h-4 w-4" />,
  "/viewings": <CalendarDays className="h-4 w-4" />,
  "/tenants": <Users className="h-4 w-4" />,
  "/agents": <UserCog className="h-4 w-4" />,
  "/payments": <Wallet className="h-4 w-4" />,
  "/maintenance": <Wrench className="h-4 w-4" />,
  "/renewals": <Repeat className="h-4 w-4" />,
  "/complaints": <MessageSquareWarning className="h-4 w-4" />,
  "/settings": <Settings className="h-4 w-4" />,
};

function isNavActive(pathname: string, to: string) {
  return pathname === to || (to !== "/dashboard" && pathname.startsWith(`${to}/`));
}

function NavItems({
  pathname,
  role,
  onNavigate,
}: {
  pathname: string;
  role: AppRole;
  onNavigate?: () => void;
}) {
  const items = getStaffNavItems(role);

  return (
    <>
      {items.map((item) => {
        const active = isNavActive(pathname, item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all ${
              active
                ? "border-l-2 border-gold bg-white/10 text-gold shadow-sm"
                : "border-l-2 border-transparent text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            {navIcons[item.to]}
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function StaffShell({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchUser = useServerFn(getCurrentUser);
  const userQ = useQuery({ queryKey: ["currentUser"], queryFn: () => fetchUser() });
  const [mobileNav, setMobileNav] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const user = userQ.data;
  const role: AppRole = user?.roles.includes("owner")
    ? "owner"
    : user?.roles.includes("agent")
      ? "agent"
      : "tenant";

  return (
    <div className="flex min-h-screen bg-mesh">
      <aside className="sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col self-start overflow-hidden bg-hero-gradient text-primary-foreground shadow-elegant md:flex">
        <div className="h-1 shrink-0 bg-gold-gradient" />
        <div className="relative z-10 border-b border-white/10 px-5 py-6">
          <Link to="/dashboard">
            <BrandLogo variant="on-dark" size="md" />
          </Link>
        </div>
        <nav className="relative z-10 flex flex-1 flex-col gap-1 overflow-hidden p-3 text-sm">
          <NavItems pathname={pathname} role={role} />
        </nav>
        <div className="relative z-10 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
            <UserAvatar
              name={user?.profile?.full_name}
              email={user?.email}
              src={user?.profile?.avatar_url}
              className="h-9 w-9"
            />
            <div className="min-w-0">
              <div className="truncate text-sm text-white">{user?.profile?.full_name ?? user?.email ?? "Signed in"}</div>
              <div className="text-xs capitalize text-white/50">{role}</div>
            </div>
          </div>
          {role === "tenant" && (
            <Button variant="ghost" size="sm" className="mb-2 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white" asChild>
              <Link to="/portal">Tenant portal</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-40" />
      </aside>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/80 bg-card/90 px-6 py-4 backdrop-blur-md">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground capitalize">{role} workspace</p>
            <h1 className="text-xl text-card-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="outline" size="icon" className="h-9 w-9 md:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="md:hidden" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </main>

      <Sheet open={mobileNav} onOpenChange={setMobileNav}>
        <SheetContent side="left" className="w-72 bg-hero-gradient p-0 text-primary-foreground">
          <SheetHeader className="border-b border-white/10 px-4 py-4 text-left">
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3 text-sm">
            <NavItems pathname={pathname} role={role} onNavigate={() => setMobileNav(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
