import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  LayoutDashboard, Building2, ClipboardList, UserSearch, Users, FileCheck2,
  Calendar, Wallet, AlertTriangle, BarChart3, Settings, Menu, LogOut, Search, Palette, ShieldCheck,
  Briefcase, FileSpreadsheet, Receipt, UserCircle, CalendarCheck, PieChart, Landmark, Command as CommandIcon,
  Stamp, Stethoscope, AlertOctagon, BedDouble, Package, CheckSquare, Globe2, Truck, Boxes, ShieldAlert, MessageSquare, Plane, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth, type AppRole } from "@/lib/auth/AuthProvider";
import { useBranding } from "@/lib/branding/BrandingProvider";
import { supabase } from "@/integrations/supabase/client";
import { GlobalSearch } from "@/components/app/GlobalSearch";
import { NotificationsBell } from "@/components/app/NotificationsBell";
import { useNavCounts } from "@/hooks/use-nav-counts";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  roles?: AppRole[];
  badge?: string;
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Operations",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/clients", label: "Clients", icon: Building2 },
      { to: "/job-orders", label: "Job Orders", icon: ClipboardList },
      { to: "/candidates", label: "Candidates", icon: UserSearch },
      { to: "/workers", label: "Workers", icon: Users },
      { to: "/placements", label: "Placements", icon: Briefcase },
      { to: "/agents", label: "Recruitment Agents", icon: Globe2, roles: ["admin", "manager", "recruiter"] },
      { to: "/tasks", label: "Tasks", icon: CheckSquare },
    ],
  },
  {
    label: "Compliance & PRO",
    items: [
      { to: "/documents", label: "Documents & Visas", icon: FileCheck2 },
      { to: "/visa-tracking", label: "Visa Workflow", icon: Stamp, roles: ["admin", "manager", "recruiter", "pro"] },
      { to: "/medical", label: "Medical Fitness", icon: Stethoscope, roles: ["admin", "manager", "recruiter", "pro"] },
      { to: "/pro-tasks", label: "PRO Tasks", icon: Landmark, roles: ["admin", "manager", "recruiter", "pro"] },
      { to: "/contracts", label: "Contracts & Letters", icon: FileText },
      { to: "/warning-letters", label: "Warning Letters", icon: AlertOctagon, roles: ["admin", "manager"] },
    ],
  },
  {
    label: "Workforce & Logistics",
    items: [
      { to: "/accommodations", label: "Accommodations", icon: BedDouble },
      { to: "/transport", label: "Transport", icon: Truck },
      { to: "/airport-pickups", label: "Airport Pickups", icon: Plane, roles: ["admin", "manager", "recruiter"] },
      { to: "/assets", label: "Uniforms & Assets", icon: Package },
      { to: "/inventory", label: "Inventory", icon: Boxes, roles: ["admin", "manager", "accountant", "payroll_officer"] },
      { to: "/incidents", label: "Incidents", icon: ShieldAlert },
      { to: "/communications", label: "Communications", icon: MessageSquare },
    ],
  },
  {
    label: "Time & Finance",
    items: [
      { to: "/attendance", label: "Attendance", icon: Calendar },
      { to: "/timesheets", label: "Timesheets", icon: FileSpreadsheet },
      { to: "/leave-approvals", label: "Leave Approvals", icon: CalendarCheck, roles: ["admin", "manager"] },
      { to: "/payroll", label: "Payroll & WPS", icon: Wallet, roles: ["admin", "manager", "accountant", "payroll_officer"] },
      { to: "/payslips", label: "Payslips", icon: Receipt, roles: ["admin", "manager", "accountant", "payroll_officer"] },
      { to: "/invoices", label: "Invoices", icon: Receipt, roles: ["admin", "manager", "accountant", "payroll_officer"] },
      { to: "/issues", label: "Welfare & Issues", icon: AlertTriangle },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "manager", "accountant", "payroll_officer"] },
      { to: "/reports", label: "Reports", icon: PieChart, roles: ["admin", "manager", "accountant", "payroll_officer"] },
    ],
  },
  {
    label: "Self-service",
    items: [
      { to: "/portal", label: "My Portal", icon: UserCircle, roles: ["worker", "admin", "manager"] },
      { to: "/client-portal", label: "Client Portal", icon: Building2, roles: ["client", "admin"] },
      { to: "/agent-portal", label: "Agent Portal", icon: Globe2, roles: ["agent", "admin", "manager"] },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, roles: ["admin"] },
      { to: "/admin/banks", label: "UAE Banks", icon: Landmark, roles: ["admin"] },
      { to: "/admin/branding", label: "Branding", icon: Palette, roles: ["admin"] },
      { to: "/admin/settings", label: "Settings", icon: Settings, roles: ["admin"] },
    ],
  },
];


function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-sand">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          <span className="text-sm">Loading workspace…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Soft redirect
    if (typeof window !== "undefined") {
      void navigate({ to: "/login", replace: true });
    }
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-sand">
      {/* Desktop sidebar — sticky, no scrollbar, premium nav progress */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile drawer — full-width, white background, dark close icon */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-screen max-w-none border-0 bg-background p-0 sm:max-w-none [&>button]:text-foreground [&>button]:opacity-100 [&>button>svg]:h-5 [&>button>svg]:w-5"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SheetDescription className="sr-only">Main application navigation</SheetDescription>
          <SidebarContent variant="light" onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1 overflow-x-clip">
          <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate, variant = "dark" }: { onNavigate?: () => void; variant?: "dark" | "light" }) {
  const { branding } = useBranding();
  const { hasAnyRole } = useAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const [navQuery, setNavQuery] = useState("");
  const navScrollRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { data: navCounts } = useNavCounts();
  const light = variant === "light";
  const t = light
    ? {
        bg: "bg-background",
        fg: "text-foreground",
        fgMute: "text-muted-foreground",
        border: "border-border",
        chip: "bg-muted/60",
        activeBg: "bg-accent",
        activePill: "text-primary",
        hoverBg: "hover:bg-muted/60",
        progress: "bg-border/60",
      }
    : {
        bg: "bg-sidebar",
        fg: "text-sidebar-foreground",
        fgMute: "text-sidebar-foreground/50",
        border: "border-sidebar-border",
        chip: "bg-sidebar-accent/40",
        activeBg: "bg-sidebar-accent",
        activePill: "text-sidebar-primary",
        hoverBg: "hover:bg-sidebar-accent/60",
        progress: "bg-sidebar-border/60",
      };

  // Track scroll position to drive the top progress indicator
  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 4 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const filteredSections = useMemo(() => {
    const q = navQuery.trim().toLowerCase();
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (i) =>
            (!i.roles || hasAnyRole(i.roles)) &&
            (!q || i.label.toLowerCase().includes(q) || section.label.toLowerCase().includes(q)),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [navQuery, hasAnyRole]);

  return (
    <div className={cn("flex h-full flex-col", t.bg)}>
      <Link to="/dashboard" onClick={onNavigate} className={cn("flex h-16 items-center border-b px-4", t.border)}>
        {(light ? branding.logo_url : branding.logo_dark_url || branding.logo_url) ? (
          <img
            src={(light ? branding.logo_url : branding.logo_dark_url || branding.logo_url) as string}
            alt={branding.company_name}
            className="h-9 w-auto max-w-full object-contain"
          />
        ) : (
          <div className={cn("truncate text-sm font-semibold", t.fg)}>{branding.company_name}</div>
        )}
      </Link>


      {/* Nav search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className={cn("pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2", t.fgMute)} />
          <input
            value={navQuery}
            onChange={(e) => setNavQuery(e.target.value)}
            placeholder="Search navigation…"
            className={cn(
              "h-8 w-full rounded-md border pl-8 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-gold/40",
              t.border,
              t.chip,
              t.fg,
              light ? "placeholder:text-muted-foreground/60" : "placeholder:text-sidebar-foreground/40",
            )}
          />
        </div>
      </div>

      {/* Sidebar progress bar (replaces scrollbar) */}
      <div className={cn("mx-3 mt-3 h-0.5 overflow-hidden rounded-full", t.progress)}>
        <div
          className="h-full bg-gold transition-[width] duration-200 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        ref={navScrollRef}
        className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4"
      >
        {filteredSections.length === 0 && (
          <div className={cn("px-3 py-8 text-center text-xs", t.fgMute)}>
            No matches
          </div>
        )}
        {filteredSections.map((section) => (
          <div key={section.label}>
            <div className={cn("px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider", t.fgMute)}>{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = currentPath === item.to || currentPath.startsWith(item.to + "/");
                const Icon = item.icon;
                const count = navCounts?.[item.to] ?? 0;
                const disabled = item.badge === "Soon";
                const content = (
                  <>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && <Badge variant="secondary" className={cn("h-5 text-[10px]", t.chip, t.fgMute)}>{item.badge}</Badge>}
                    {!item.badge && count > 0 && (
                      <Badge className="h-5 min-w-5 justify-center bg-gold px-1.5 text-[10px] font-medium text-gold-foreground">
                        {count > 99 ? "99+" : count}
                      </Badge>
                    )}
                  </>
                );
                return disabled ? (
                  <div key={item.to} className={cn("flex cursor-not-allowed items-center gap-2.5 rounded-md px-3 py-2 text-sm", t.fgMute)}>
                    {content}
                  </div>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-smooth",
                      active
                        ? cn(t.activeBg, t.activePill, "shadow-soft")
                        : cn(light ? "text-foreground/70" : "text-sidebar-foreground/70", t.hoverBg, light ? "hover:text-foreground" : "hover:text-sidebar-foreground"),
                    )}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={cn("border-t p-3 text-[10px]", t.border, t.fgMute)}>
        v1.1 · Lifecycle & Finance
      </div>
    </div>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile, user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const initials = (profile?.full_name ?? user?.email ?? "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  // ⌘K / Ctrl-K opens global search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 w-full min-w-0 max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background/60 px-3 text-left text-sm text-muted-foreground transition-smooth hover:border-gold/40 hover:text-foreground md:flex md:max-w-md lg:max-w-lg"
            aria-label="Open global search"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 truncate">Search workers, clients, job orders…</span>
            <span className="hidden items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] sm:flex">
              <CommandIcon className="h-3 w-3" /> K
            </span>
          </button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <NotificationsBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-3 transition-smooth hover:bg-accent">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">{initials}</AvatarFallback></Avatar>
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-medium leading-tight">{profile?.full_name ?? user?.email}</div>
                    <div className="text-[11px] capitalize text-muted-foreground leading-tight">{roles[0] ?? "member"}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{profile?.full_name ?? "Account"}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
