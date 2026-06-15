import { Link } from "@tanstack/react-router";
import {
  ArrowDownUp,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Database,
  FileCheck2,
  Filter,
  Gauge,
  Grid2X2,
  HelpCircle,
  Hotel,
  Layers,
  LogOut,
  Mail,
  Moon,
  MoreHorizontal,
  Plane,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Sun,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  DashboardOverview,
  Metric,
  PaymentCard,
  Transaction,
  Wallet,
} from "@/lib/dashboard-data";

type StatusFilter = "all" | Transaction["status"];

export const navTabs = [
  { label: "Overview", to: "/" },
  { label: "Activity", to: "/activity" },
  { label: "Manage", to: "/manage" },
  { label: "Program", to: "/program" },
  { label: "Account", to: "/account" },
  { label: "Reports", to: "/reports" },
] as const;

const sidebarMain: Array<{ icon: LucideIcon; label: string; active?: boolean }> = [
  { icon: Grid2X2, label: "Overview", active: true },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Mail, label: "Messages" },
  { icon: ReceiptText, label: "Documents" },
  { icon: UsersRound, label: "Teams" },
  { icon: Layers, label: "Layers" },
  { icon: Settings, label: "Settings" },
];

const mobileNav = sidebarMain.slice(0, 5);

const transactionIcons: Record<Transaction["icon"], LucideIcon> = {
  app: Smartphone,
  hotel: Hotel,
  flight: Plane,
  grocery: ShoppingBasket,
  software: FileCheck2,
};

const metricIcons: Record<Metric["type"], LucideIcon> = {
  earning: WalletCards,
  spending: CreditCard,
  income: Database,
  revenue: CircleDollarSign,
};

const currencySymbols: Record<Wallet["currency"], string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function BongoFiDashboard({ overview }: { overview: DashboardOverview }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return overview.transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [
          transaction.orderId,
          transaction.activity,
          transaction.status,
          transaction.date,
          formatCurrency(transaction.price),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [overview.transactions, searchQuery, statusFilter]);

  const nextFilter = () => {
    const filters: StatusFilter[] = ["all", "completed", "pending", "in_progress"];
    const currentIndex = filters.indexOf(statusFilter);
    setStatusFilter(filters[(currentIndex + 1) % filters.length]);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#E9EAEC] p-3 text-[#111111] sm:p-6 lg:h-screen lg:overflow-hidden lg:p-10">
      <section className="dashboard-shell mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-none flex-col overflow-x-hidden rounded-[28px] bg-[#F5F5F3] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] sm:min-h-[calc(100vh-3rem)] sm:p-6 lg:h-[calc(100vh-5rem)] lg:min-h-0 lg:overflow-hidden">
        <DashboardTopbar user={overview.user} />

        <div className="flex min-h-0 flex-1 gap-4 pt-6 lg:gap-5">
          <DashboardSidebar />

          <section className="dashboard-content-scroll min-w-0 max-w-full flex-1 pb-20 lg:overflow-y-auto lg:pb-0 lg:pr-1">
            <Greeting />

            <div className="dashboard-grid mt-5 grid min-w-0 gap-4 xl:grid-cols-[1.05fr_1fr_1.1fr]">
              <BalanceCard overview={overview} />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {overview.metrics.map((metric, index) => (
                  <MetricCard key={metric.id} metric={metric} index={index} />
                ))}
              </div>

              <IncomeChartCard chart={overview.incomeChart} />
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_2fr]">
              <div className="grid gap-4">
                <SpendingLimitCard
                  limit={overview.spendingLimit.limit}
                  spent={overview.spendingLimit.spent}
                />
                <MyCardsWidget cards={overview.cards} />
              </div>

              <RecentActivities
                filter={statusFilter}
                onFilterChange={nextFilter}
                onSearchChange={setSearchQuery}
                searchQuery={searchQuery}
                transactions={filteredTransactions}
              />
            </div>
          </section>
        </div>

        <DashboardMobileNav />
      </section>
    </main>
  );
}

export function DashboardTopbar({ user }: { user: DashboardOverview["user"] }) {
  return (
    <header className="topbar-reveal flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
          <div className="grid size-8 place-items-center rounded-xl bg-[#0b7a3d] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
            <ArrowDownUp className="size-4 rotate-45" />
          </div>
          <span className="text-xs font-semibold">Bongo-Fi</span>
        </div>

        <nav className="hidden gap-1.5 rounded-2xl bg-white/90 p-1 shadow-sm lg:flex">
          {navTabs.map((tab) => (
            <Link
              activeOptions={{ exact: tab.to === "/" }}
              activeProps={{
                className:
                  "bg-[#101010] text-white hover:bg-[#101010] hover:text-white",
              }}
              className={cn(
                "rounded-xl px-5 py-2 text-xs font-medium text-[#565656] transition hover:bg-[#f0f0ee] hover:text-[#101010] xl:px-6",
              )}
              key={tab.to}
              to={tab.to}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1 rounded-2xl bg-white px-2 py-2 shadow-sm sm:flex">
          <IconButton icon={Search} label="Search" />
          <button
            aria-label="Notifications"
            className="relative grid size-8 place-items-center rounded-xl text-[#151515] transition hover:bg-[#f0f0ee]"
            type="button"
          >
            <Bell className="size-4" />
            <span className="notification-dot absolute right-2 top-2 size-1.5 rounded-full bg-[#ff5f35]" />
          </button>
          <IconButton icon={Gauge} label="Status" />
        </div>

        <button
          className="flex min-w-0 items-center gap-2 rounded-2xl bg-white p-1.5 pr-2 shadow-sm transition hover:bg-[#f7f7f5]"
          type="button"
        >
          <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#1d1a16] text-[15px] text-white">
            {user.name.charAt(0)}
          </div>
          <span className="hidden min-w-0 text-left sm:block">
            <span className="block truncate text-xs font-semibold">{user.name}</span>
            <span className="block max-w-[112px] truncate text-[10px] text-[#777]">
              {user.email}
            </span>
          </span>
          <ChevronDown className="hidden size-3.5 text-[#777] sm:block" />
        </button>
      </div>
    </header>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="sidebar-reveal hidden w-12 shrink-0 flex-col items-center justify-between py-2 lg:flex">
      <div className="grid gap-2">
        <IconButton icon={Sun} label="Light mode" />
        <IconButton icon={Moon} label="Dark mode" />
      </div>

      <nav className="grid gap-2">
        {sidebarMain.map(({ active, icon: Icon, label }, index) => (
          <button
            aria-label={label}
            className={cn(
              "sidebar-item grid size-9 place-items-center rounded-xl text-[#404040] transition hover:bg-white hover:text-[#101010]",
              active && "bg-[#101010] text-white hover:bg-[#101010] hover:text-white",
            )}
            key={label}
            style={{ animationDelay: `${120 + index * 40}ms` }}
            type="button"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </nav>

      <div className="grid gap-2">
        <IconButton icon={HelpCircle} label="Help" />
        <IconButton icon={LogOut} label="Logout" />
      </div>
    </aside>
  );
}

function Greeting() {
  return (
    <div className="card-reveal" style={{ animationDelay: "120ms" }}>
      <h1 className="text-[26px] font-medium tracking-[-0.04em] text-[#101010] sm:text-[30px]">
        Good morning, Bongo
      </h1>
      <p className="mt-1 text-xs text-[#5f5f5f] sm:text-sm">
        Stay on top of your tasks, monitor progress, and track status.
      </p>
    </div>
  );
}

function BalanceCard({ overview }: { overview: DashboardOverview }) {
  return (
    <Card className="card-reveal flex min-h-[266px] flex-col gap-4" style={{ animationDelay: "190ms" }}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#555]">Total Balance</span>
        <button
          className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#333] shadow-sm"
          type="button"
        >
          <Flag label="US" />
          USD
          <ChevronDown className="size-3" />
        </button>
      </div>

      <div>
        <div className="text-[30px] font-semibold tracking-[-0.04em]">
          {formatCurrency(overview.totalBalance)}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[10px]">
          <span className="rounded-md bg-[#dfffbd] px-2 py-0.5 font-semibold text-[#177d38]">
            ↑ {overview.balanceGrowth}%
          </span>
          <span className="text-[#6f6f6f]">than last month</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" type="button">
          <ArrowDownUp className="size-3.5" />
          Transfer
        </Button>
        <Button size="sm" type="button" variant="secondary">
          <ArrowDownUp className="size-3.5" />
          Request
        </Button>
      </div>

      <div className="mt-auto rounded-[18px] bg-white/55 p-2">
        <div className="mb-2 flex items-center gap-1 text-[11px]">
          <span className="font-medium">Wallets</span>
          <span className="text-[#777]">| Total {overview.wallets.length * 2} wallets</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {overview.wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function WalletCard({ wallet }: { wallet: Wallet }) {
  const isActive = wallet.status === "active";

  return (
    <div className="rounded-2xl bg-[#f8f8f7] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold">
          <Flag label={wallet.flag} />
          {wallet.currency}
        </div>
        <MoreHorizontal className="size-3.5 text-[#777]" />
      </div>
      <div className="mt-2 text-xs font-semibold">
        {currencySymbols[wallet.currency]}
        {wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </div>
      <div className="mt-1 text-[8px] text-[#777]">
        Limit {wallet.monthlyLimitUsed}/{wallet.monthlyLimit}x a month
      </div>
      <div
        className={cn(
          "mt-2 text-[9px] font-semibold capitalize",
          isActive ? "text-[#28a94f]" : "text-[#ff4d5e]",
        )}
      >
        {wallet.status}
      </div>
    </div>
  );
}

function MetricCard({ index, metric }: { index: number; metric: Metric }) {
  const Icon = metricIcons[metric.type];
  const positive = metric.changePercentage >= 0;

  return (
    <Card
      className={cn(
        "card-reveal min-h-[112px] p-4",
        metric.highlighted &&
          "overflow-hidden border-0 bg-[radial-gradient(circle_at_82%_18%,rgba(182,255,46,0.42),transparent_34%),linear-gradient(135deg,#87e936_0%,#003a29_60%,#002719_100%)] text-white shadow-[0_16px_34px_rgba(0,59,40,0.16)] hover:shadow-[0_20px_44px_rgba(0,59,40,0.2)]",
      )}
      style={{ animationDelay: `${260 + index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-medium">{metric.label}</div>
        <div
          className={cn(
            "grid size-7 place-items-center rounded-lg bg-white text-[#101010] shadow-sm",
            metric.highlighted && "bg-white/12 text-white ring-1 ring-white/20",
          )}
        >
          <Icon className="size-3.5" />
        </div>
      </div>
      <div className="mt-5 text-[30px] font-semibold tracking-[-0.05em]">
        {formatCurrency(metric.value, { compact: true })}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px]">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 font-semibold",
            positive
              ? "bg-[#dfffbd] text-[#178034]"
              : "bg-[#ffe8ec] text-[#ff4d5e]",
            metric.highlighted && "bg-[#B6FF2E]/18 text-[#B6FF2E]",
          )}
        >
          {positive ? "↑" : "↓"} {Math.abs(metric.changePercentage)}%
        </span>
        <span className={cn("text-[#777]", metric.highlighted && "text-white/72")}>
          {metric.period}
        </span>
      </div>
    </Card>
  );
}

function IncomeChartCard({ chart }: { chart: DashboardOverview["incomeChart"] }) {
  return (
    <Card className="card-reveal min-h-[266px]" style={{ animationDelay: "330ms" }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em]">Total Income</h2>
          <p className="mt-1 text-[11px] text-[#6f6f6f]">
            View your income in a certain period of time
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white/55 p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold">Profit and Loss</span>
          <div className="flex items-center gap-3 text-[10px]">
            <Legend color="bg-[#B6FF2E]" label="Profit" />
            <Legend color="bg-[#101010]" label="Loss" />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-2">
          <div className="flex h-[150px] flex-col justify-between text-[9px] text-[#9a9a9a]">
            <span>50k</span>
            <span>40k</span>
            <span>30k</span>
            <span>20k</span>
            <span>10k</span>
            <span>00</span>
          </div>
          <div className="relative min-w-0 overflow-x-auto">
            <div className="relative min-w-[286px] sm:min-w-0">
              <div className="absolute inset-x-0 top-0 h-[150px] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_29px,rgba(0,0,0,0.055)_30px)]" />
              <div className="relative grid h-[176px] grid-cols-8 items-end gap-2">
                {chart.map((item, index) => (
                  <div
                    className="flex h-full flex-col items-center justify-end gap-2"
                    key={item.month}
                  >
                    <div className="flex h-[150px] items-end gap-1">
                      <span
                        className="chart-bar block w-5 rounded-t-md rounded-b-md bg-[#B6FF2E]"
                        style={{
                          animationDelay: `${index * 60}ms`,
                          height: `${Math.max(item.profit * 2.1, 12)}px`,
                        }}
                      />
                      <span
                        className="chart-bar block w-5 rounded-t-md rounded-b-md bg-[#101010]"
                        style={{
                          animationDelay: `${80 + index * 60}ms`,
                          height: `${Math.max(item.loss * 2.1, 12)}px`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-[#777]">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SpendingLimitCard({ limit, spent }: { limit: number; spent: number }) {
  const percentage = Math.round((spent / limit) * 100);

  return (
    <Card className="card-reveal" style={{ animationDelay: "400ms" }}>
      <h2 className="text-sm font-semibold">Monthly Spending Limit</h2>
      <div className="mt-6 h-2 overflow-hidden rounded-md bg-[repeating-linear-gradient(120deg,#dededb_0,#dededb_2px,#f5f5f2_2px,#f5f5f2_6px)]">
        <span
          className="spending-progress block h-full rounded-md bg-[#003B28]"
          style={{ "--progress": `${percentage}%` } as CSSProperties}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-[#606060]">
        <span>
          <strong className="text-[#101010]">{formatCurrency(spent)}</strong> spent out of
        </span>
        <strong className="text-[#101010]">{formatCurrency(limit)}</strong>
      </div>
    </Card>
  );
}

function MyCardsWidget({ cards }: { cards: PaymentCard[] }) {
  return (
    <Card className="card-reveal overflow-hidden" style={{ animationDelay: "470ms" }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-white shadow-sm">
            <CreditCard className="size-4" />
          </span>
          <h2 className="text-sm font-semibold">My Cards</h2>
        </div>
        <Button size="sm" type="button" variant="secondary">
          + Add new
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <PaymentCardPreview card={card} key={card.id} />
        ))}
      </div>
    </Card>
  );
}

function PaymentCardPreview({ card }: { card: PaymentCard }) {
  return (
    <div
      className={cn(
        "relative aspect-[1.65/1] overflow-hidden rounded-2xl p-3 text-white shadow-[0_18px_35px_rgba(0,0,0,0.14)]",
        card.tone === "black"
          ? "bg-[radial-gradient(circle_at_76%_32%,rgba(182,255,46,0.2),transparent_28%),linear-gradient(135deg,#222_0%,#0e0e0e_100%)]"
          : "bg-[radial-gradient(circle_at_80%_45%,rgba(182,255,46,0.42),transparent_31%),linear-gradient(135deg,#004231_0%,#082318_100%)]",
      )}
    >
      <div className="absolute -right-4 -top-8 size-28 rounded-[32px] bg-white/5 blur-xl" />
      <div className="relative flex items-center justify-between">
        <Sparkles className="size-4" />
        <span className="rounded-md bg-white px-2 py-0.5 text-[9px] font-semibold text-[#101010]">
          {card.status}
        </span>
      </div>
      <div className="relative mt-8 text-[10px] text-white/62">Card Number</div>
      <div className="relative mt-1 text-xs font-semibold tracking-[0.15em]">{card.number}</div>
      <div className="relative mt-4 flex items-end justify-between text-[9px] text-white/70">
        <span>
          Exp
          <strong className="mt-1 block text-white">{card.expiry}</strong>
        </span>
        <span>
          CVV
          <strong className="mt-1 block text-white">{card.cvv}</strong>
        </span>
        {card.tone === "black" && (
          <span className="flex -space-x-2">
            <span className="size-5 rounded-full bg-[#ec3b31]" />
            <span className="size-5 rounded-full bg-[#ffbd2f]" />
          </span>
        )}
      </div>
    </div>
  );
}

function RecentActivities({
  filter,
  onFilterChange,
  onSearchChange,
  searchQuery,
  transactions,
}: {
  filter: StatusFilter;
  onFilterChange: () => void;
  onSearchChange: (value: string) => void;
  searchQuery: string;
  transactions: Transaction[];
}) {
  return (
    <Card className="card-reveal min-h-[300px]" style={{ animationDelay: "540ms" }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold tracking-[-0.02em]">Recent Activities</h2>
        <div className="flex gap-2">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e8e8e5] bg-white px-3 transition focus-within:w-[240px] focus-within:border-[#B6FF2E] sm:w-[200px]">
            <Search className="size-4 shrink-0 text-[#555]" />
            <input
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#777]"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search"
              type="search"
              value={searchQuery}
            />
          </label>
          <button
            className="flex h-10 items-center gap-2 rounded-xl border border-[#e8e8e5] bg-white px-3 text-xs font-medium transition hover:bg-[#f0f0ee]"
            onClick={onFilterChange}
            type="button"
          >
            {filter === "all" ? "Filter" : statusLabel(filter)}
            <Filter className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-[#ececea] bg-white/55 md:block">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-[#f4f4f2] text-[11px] font-medium text-[#777]">
            <tr>
              <th className="w-10 px-4 py-3">
                <span className="grid size-4 place-items-center rounded border border-[#dcdcd8] bg-white" />
              </th>
              <th className="px-2 py-3">Order ID</th>
              <th className="px-2 py-3">Activity</th>
              <th className="px-2 py-3">Price</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <TransactionRow
                checked={index === 3}
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {transactions.map((transaction) => (
          <TransactionMobileCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="grid min-h-28 place-items-center rounded-2xl bg-white/60 text-xs text-[#777]">
          No activities match the current search.
        </div>
      )}
    </Card>
  );
}

function TransactionRow({
  checked,
  transaction,
}: {
  checked: boolean;
  transaction: Transaction;
}) {
  const Icon = transactionIcons[transaction.icon];

  return (
    <tr className="border-t border-[#ececea] transition hover:bg-[#F4F4F2]">
      <td className="px-4 py-3">
        <span
          className={cn(
            "grid size-4 place-items-center rounded border border-[#dcdcd8] bg-white",
            checked && "border-[#101010] bg-[#101010]",
          )}
        >
          {checked && <span className="size-1.5 rounded-full bg-white" />}
        </span>
      </td>
      <td className="whitespace-nowrap px-2 py-3 font-medium">{transaction.orderId}</td>
      <td className="px-2 py-3">
        <span className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-md bg-[#edf7ff] text-[#1f87ff]">
            <Icon className="size-3" />
          </span>
          {transaction.activity}
        </span>
      </td>
      <td className="whitespace-nowrap px-2 py-3 font-medium">
        {formatCurrency(transaction.price)}
      </td>
      <td className="whitespace-nowrap px-2 py-3">
        <StatusBadge status={transaction.status} />
      </td>
      <td className="whitespace-nowrap px-2 py-3 text-[#303030]">{transaction.date}</td>
      <td className="px-4 py-3 text-right">
        <MoreHorizontal className="ml-auto size-4 text-[#555]" />
      </td>
    </tr>
  );
}

function TransactionMobileCard({ transaction }: { transaction: Transaction }) {
  const Icon = transactionIcons[transaction.icon];

  return (
    <div className="rounded-2xl bg-white/70 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[#edf7ff] text-[#1f87ff]">
            <Icon className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{transaction.activity}</h3>
            <p className="mt-1 text-[11px] text-[#777]">{transaction.orderId}</p>
          </div>
        </div>
        <MoreHorizontal className="size-4 text-[#555]" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <strong>{formatCurrency(transaction.price)}</strong>
        <StatusBadge status={transaction.status} />
      </div>
      <p className="mt-3 text-[11px] text-[#777]">{transaction.date}</p>
    </div>
  );
}

export function DashboardMobileNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-20 grid grid-cols-5 rounded-2xl bg-white/90 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur lg:hidden">
      {mobileNav.map(({ active, icon: Icon, label }) => (
        <button
          aria-label={label}
          className={cn(
            "mx-auto grid size-10 place-items-center rounded-xl text-[#555]",
            active && "bg-[#101010] text-white",
          )}
          key={label}
          type="button"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </nav>
  );
}

function IconButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid size-9 place-items-center rounded-xl text-[#3f3f3f] transition hover:bg-white hover:text-[#101010] sm:size-8"
      type="button"
    >
      <Icon className="size-4" />
    </button>
  );
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-1.5 rounded-full", statusColor(status))} />
      {statusLabel(status)}
    </span>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2 rounded-sm", color)} />
      {label}
    </span>
  );
}

function Flag({ label }: { label: string }) {
  return (
    <span className="grid size-4 place-items-center rounded-md bg-[#f1f1ef] text-[7px] font-bold text-[#224] ring-1 ring-black/5">
      {label}
    </span>
  );
}

function statusColor(status: Transaction["status"]) {
  if (status === "completed") return "bg-[#28c76f]";
  if (status === "pending") return "bg-[#ff4d5e]";
  return "bg-[#ffd84d]";
}

function statusLabel(status: Transaction["status"]) {
  if (status === "in_progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatCurrency(
  value: number,
  options: { compact?: boolean } = {},
) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: options.compact ? 0 : 2,
    minimumFractionDigits: options.compact ? 0 : 2,
    style: "currency",
  }).format(value);
}
