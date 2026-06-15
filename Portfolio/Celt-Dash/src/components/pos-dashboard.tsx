import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  Edit3,
  Eye,
  FileText,
  MapPin,
  Menu,
  MessageCircle,
  PackagePlus,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  ShoppingBag,
  Truck,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  Warehouse,
} from 'lucide-react'
import type * as React from 'react'
import { useMemo, useState } from 'react'

import { Button } from '#/components/ui/button'
import { GlassCard } from '#/components/ui/glass-card'
import { StyledSelect } from '#/components/ui/select'
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader } from '#/components/ui/sheet'
import { StatusBadge } from '#/components/ui/status-badge'
import { cn } from '#/lib/utils'

type InvoiceStatus = 'Waiting' | 'Delivered' | 'Decline'
type PageName = 'Dashboard' | 'Analytics' | 'Invoices' | 'Calendar' | 'Products'
type CrudIntent = 'create' | 'view' | 'edit' | 'delete' | 'report' | 'export' | 'restock' | 'schedule'
type CrudEntity = 'invoice' | 'report' | 'insight' | 'event' | 'product' | 'warehouse'

type CrudSheetState = {
  description: string
  entity: CrudEntity
  intent: CrudIntent
  title: string
}

type Invoice = {
  id: string
  customerName: string
  customerType: string
  status: InvoiceStatus
  amount: number
  createdAt: string
  initials: string
}

type NewInvoiceForm = {
  customerName: string
  customerType: string
  amount: string
  status: InvoiceStatus
}

type Product = {
  id: string
  name: string
  category: string
  stock: number
  price: number
  status: 'In stock' | 'Low stock' | 'Out of stock'
}

type CalendarEvent = {
  id: string
  title: string
  owner: string
  time: string
  type: 'Stock count' | 'Shipment' | 'Invoice review' | 'Promotion'
}

const navItems: Array<PageName> = ['Dashboard', 'Analytics', 'Invoices', 'Calendar', 'Products']

const dateRangeOptions = [
  { label: 'Last 7 days', value: 'Last 7 days' },
  { label: 'Last 30 days', value: 'Last 30 days' },
  { label: 'This quarter', value: 'This quarter' },
]

const marketCategoryOptions = [
  { label: 'All categories', value: 'All categories' },
  { label: 'Fashion', value: 'Fashion' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Food', value: 'Food' },
]

const invoiceCategoryOptions = [
  { label: 'All types', value: 'All types' },
  { label: 'Fashion retail', value: 'Fashion retail' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Groceries', value: 'Groceries' },
  { label: 'Wholesale', value: 'Wholesale' },
]

const invoiceStatusOptions = [
  { label: 'Waiting', value: 'Waiting' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Decline', value: 'Decline' },
]

const salesData = [
  { day: '04', sales: 42, transactions: 28, repeat: 18 },
  { day: '06', sales: 62, transactions: 44, repeat: 26 },
  { day: '08', sales: 48, transactions: 36, repeat: 20 },
  { day: '10', sales: 78, transactions: 58, repeat: 31 },
  { day: '12', sales: 54, transactions: 41, repeat: 28 },
  { day: '14', sales: 91, transactions: 72, repeat: 42 },
  { day: '16', sales: 67, transactions: 54, repeat: 34 },
  { day: '18', sales: 82, transactions: 63, repeat: 39 },
  { day: '20', sales: 58, transactions: 46, repeat: 25 },
  { day: '22', sales: 96, transactions: 76, repeat: 48 },
  { day: '24', sales: 73, transactions: 59, repeat: 36 },
  { day: '26', sales: 88, transactions: 69, repeat: 44 },
]

const marketDemand = [
  { category: 'Fashion', value: 82, helper: '+18.2%', color: 'bg-orange-400' },
  { category: 'Electronics', value: 68, helper: '+12.7%', color: 'bg-emerald-400' },
  { category: 'Food', value: 46, helper: '+7.4%', color: 'bg-cream/50' },
]

const kpis = [
  { label: 'Total shipment', value: '470', change: '+12.4%', icon: Truck },
  { label: 'Total order', value: '3.048', change: '+24.8%', icon: ShoppingBag },
  { label: 'Refund', value: '21', change: '-2.1%', icon: RotateCcw },
  { label: 'Products sale', value: '7.046', change: '+18.6%', icon: PackageCheck },
]

const analyticsSegments = [
  { label: 'Gross revenue', value: '$84.2k', change: '+18.4%', icon: TrendingUp },
  { label: 'Conversion rate', value: '42.8%', change: '+6.1%', icon: Users },
  { label: 'Avg. order value', value: '$128', change: '+9.7%', icon: BarChart3 },
  { label: 'Refund exposure', value: '$1.9k', change: '-2.1%', icon: RotateCcw },
]

const initialInvoices: Array<Invoice> = [
  {
    id: 'INV-2931',
    customerName: 'Ethan Richards',
    customerType: 'Fashion retail',
    status: 'Waiting',
    amount: 1280,
    createdAt: 'Today, 09:24',
    initials: 'ER',
  },
  {
    id: 'INV-2929',
    customerName: 'Maya Chen',
    customerType: 'Electronics',
    status: 'Delivered',
    amount: 3420,
    createdAt: 'Today, 08:58',
    initials: 'MC',
  },
  {
    id: 'INV-2927',
    customerName: 'Noah Carter',
    customerType: 'Groceries',
    status: 'Decline',
    amount: 870,
    createdAt: 'Yesterday, 18:11',
    initials: 'NC',
  },
  {
    id: 'INV-2924',
    customerName: 'Ava Thompson',
    customerType: 'Wholesale',
    status: 'Delivered',
    amount: 2190,
    createdAt: 'Yesterday, 16:42',
    initials: 'AT',
  },
]

const products: Array<Product> = [
  { id: 'SKU-1048', name: 'Aster Linen Jacket', category: 'Fashion', stock: 84, price: 128, status: 'In stock' },
  { id: 'SKU-2281', name: 'Pulse Mini Speaker', category: 'Electronics', stock: 18, price: 89, status: 'Low stock' },
  { id: 'SKU-3410', name: 'Roasted Arabica Beans', category: 'Food', stock: 0, price: 24, status: 'Out of stock' },
  { id: 'SKU-4112', name: 'Nomad Travel Tote', category: 'Fashion', stock: 52, price: 96, status: 'In stock' },
]

const calendarEvents: Array<CalendarEvent> = [
  { id: 'EVT-14', title: 'Morning stock count', owner: 'Warehouse team', time: '09:00', type: 'Stock count' },
  { id: 'EVT-18', title: 'Midtown shipment handoff', owner: 'Jordan Miles', time: '11:30', type: 'Shipment' },
  { id: 'EVT-23', title: 'Waiting invoices review', owner: 'Finance desk', time: '14:00', type: 'Invoice review' },
  { id: 'EVT-31', title: 'Weekend fashion promo', owner: 'Retail ops', time: '16:30', type: 'Promotion' },
]

const heatmap = [
  [0, 1, 2, 3, 1, 0, 2],
  [1, 2, 4, 3, 2, 1, 3],
  [2, 4, 5, 4, 3, 2, 4],
  [1, 3, 4, 5, 4, 2, 3],
  [0, 2, 3, 4, 5, 3, 2],
  [1, 2, 2, 3, 4, 5, 4],
]

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const assistantActions = ['Sales report', 'Top sell', 'Low performing products', 'Restock alert']
const premiumEase = [0.16, 1, 0.3, 1] as const

const shellVariants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: premiumEase } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.07, duration: 0.5, ease: premiumEase },
  }),
}

export function PosDashboard() {
  const [activePage, setActivePage] = useState<PageName>('Dashboard')
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [category, setCategory] = useState('All categories')
  const [invoiceCategory, setInvoiceCategory] = useState('All types')
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All')
  const [assistantPrompt, setAssistantPrompt] = useState('')
  const [assistantResponse, setAssistantResponse] = useState('Ask for sales, stock, invoice, or restock insight.')
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [crudSheet, setCrudSheet] = useState<CrudSheetState | null>(null)
  const [invoices, setInvoices] = useState(initialInvoices)
  const [form, setForm] = useState<NewInvoiceForm>({
    customerName: '',
    customerType: '',
    amount: '',
    status: 'Waiting',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof NewInvoiceForm, string>>>({})

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter
      const matchesCategory = invoiceCategory === 'All types' || invoice.customerType === invoiceCategory

      return matchesStatus && matchesCategory
    })
  }, [invoiceCategory, invoices, statusFilter])

  const totalInvoiceValue = useMemo(() => {
    return invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  }, [invoices])

  function handleAssistantSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const prompt = assistantPrompt.trim()

    if (!prompt) {
      setAssistantResponse('Type a question first, for example: which products need restock?')
      return
    }

    setAssistantResponse(
      `Insight queued for "${prompt}". Current invoice value is ${formatCurrency(totalInvoiceValue)} with ${
        invoices.filter((invoice) => invoice.status === 'Waiting').length
      } waiting invoice(s).`,
    )
    setAssistantPrompt('')
  }

  function updateForm<TKey extends keyof NewInvoiceForm>(key: TKey, value: NewInvoiceForm[TKey]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function createInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Partial<Record<keyof NewInvoiceForm, string>> = {}
    const numericAmount = Number(form.amount)

    if (!form.customerName.trim()) {
      nextErrors.customerName = 'Customer name is required.'
    }

    if (!form.customerType.trim()) {
      nextErrors.customerType = 'Customer category is required.'
    }

    if (!form.amount.trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Enter an invoice amount above 0.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const initials = form.customerName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join('')

    setInvoices((current) => [
      {
        id: `INV-${2932 + current.length}`,
        customerName: form.customerName.trim(),
        customerType: form.customerType.trim(),
        amount: numericAmount,
        status: form.status,
        createdAt: 'Just now',
        initials: initials || 'NC',
      },
      ...current,
    ])
    setForm({ customerName: '', customerType: '', amount: '', status: 'Waiting' })
    setIsInvoiceSheetOpen(false)
  }

  function openCrudSheet(intent: CrudIntent, entity: CrudEntity, title: string, description: string) {
    setCrudSheet({ description, entity, intent, title })
  }

  return (
    <main className="min-h-screen bg-charcoal text-cream">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(101,38,12,0.35),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(255,100,30,0.08),transparent_35%),#46474A]" />
      <div className="grain fixed inset-0 -z-10 opacity-[0.04]" />

      <motion.div
        animate="visible"
        className="flex min-h-screen w-full flex-col border border-white/[0.06] bg-[radial-gradient(circle_at_16%_0%,rgba(242,106,46,0.18),transparent_31%),linear-gradient(145deg,#160b05_0%,#070503_56%,#120804_100%)] p-3 shadow-[0_34px_100px_rgba(0,0,0,0.55)] sm:p-4 lg:p-5"
        initial="hidden"
        variants={shellVariants}
      >
        <TopNavigation
          activePage={activePage}
          mobileMenuOpen={mobileMenuOpen}
          onMobileMenuToggle={() => setMobileMenuOpen((current) => !current)}
          onNavigate={(page) => {
            setActivePage(page)
            setMobileMenuOpen(false)
          }}
        />

        {activePage === 'Dashboard' ? (
          <DashboardPage
            assistantPrompt={assistantPrompt}
            assistantResponse={assistantResponse}
            category={category}
            dateRange={dateRange}
            filteredInvoices={filteredInvoices}
            invoiceCategory={invoiceCategory}
            onAssistantPromptChange={setAssistantPrompt}
            onAssistantSubmit={handleAssistantSubmit}
            onCategoryChange={setCategory}
            onCrudAction={openCrudSheet}
            onDateRangeChange={setDateRange}
            onInvoiceCategoryChange={setInvoiceCategory}
            onNewInvoice={() => setIsInvoiceSheetOpen(true)}
            onStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />
        ) : null}
        {activePage === 'Analytics' ? <AnalyticsPage onCrudAction={openCrudSheet} /> : null}
        {activePage === 'Invoices' ? (
          <InvoicesPage
            invoiceCategory={invoiceCategory}
            invoices={filteredInvoices}
            onCrudAction={openCrudSheet}
            onInvoiceCategoryChange={setInvoiceCategory}
            onNewInvoice={() => setIsInvoiceSheetOpen(true)}
            onStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />
        ) : null}
        {activePage === 'Calendar' ? <CalendarPage onCrudAction={openCrudSheet} /> : null}
        {activePage === 'Products' ? <ProductsPage onCrudAction={openCrudSheet} /> : null}
      </motion.div>

      <NewInvoiceSheet
        errors={errors}
        form={form}
        isOpen={isInvoiceSheetOpen}
        onClose={() => setIsInvoiceSheetOpen(false)}
        onSubmit={createInvoice}
        onUpdate={updateForm}
      />
      <CrudActionSheet onClose={() => setCrudSheet(null)} sheet={crudSheet} />
    </main>
  )
}

function TopNavigation({
  activePage,
  mobileMenuOpen,
  onMobileMenuToggle,
  onNavigate,
}: {
  activePage: PageName
  mobileMenuOpen: boolean
  onMobileMenuToggle: () => void
  onNavigate: (page: PageName) => void
}) {
  return (
    <motion.nav
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-wrap items-center gap-3 rounded border border-white/[0.06] bg-white/[0.035] p-2"
      initial={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: premiumEase }}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded bg-[linear-gradient(180deg,#f46f35,#b83512)] shadow-[0_0_22px_rgba(242,106,46,0.34)]">
        <CircleDollarSign className="size-5" />
      </div>

      <button
        aria-expanded={mobileMenuOpen}
        className="ml-auto flex size-9 items-center justify-center rounded border border-white/[0.06] bg-white/[0.04] text-cream/70 md:hidden"
        onClick={onMobileMenuToggle}
        type="button"
      >
        <Menu className="size-4" />
      </button>

      <div className="no-scrollbar hidden flex-1 gap-1 overflow-x-auto md:flex">
        {navItems.map((item) => (
          <button
            className={cn(
              'shrink-0 rounded px-3 py-2 text-xs font-medium text-muted transition hover:bg-white/[0.05] hover:text-cream',
              item === activePage &&
                'bg-[linear-gradient(180deg,#f46f35,#b83512)] text-white shadow-[0_0_18px_rgba(240,92,35,0.35)]',
            )}
            key={item}
            onClick={() => onNavigate(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <IconPill icon={Search} label="Search" />
        <IconPill icon={Bell} label="Notifications" />
        <div className="flex items-center gap-2 rounded border border-white/[0.06] bg-white/[0.04] py-1 pl-1 pr-3">
          <div className="flex size-8 items-center justify-center rounded bg-cream/10 text-xs font-medium text-cream">MB</div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-cream">Mapenzi Bongo</p>
            <p className="text-[0.625rem] text-muted">Mapenzibongo@gmail.com</p>
          </div>
        </div>
        <IconPill icon={Settings} label="Settings" />
      </div>
      {mobileMenuOpen ? (
        <div className="grid basis-full gap-2 rounded border border-white/[0.06] bg-black/20 p-2 md:hidden">
          {navItems.map((item) => (
            <button
              className={cn(
                'rounded px-3 py-2 text-left text-sm font-medium text-muted transition hover:bg-white/[0.05] hover:text-cream',
                item === activePage && 'bg-orange-400/15 text-orange-100',
              )}
              key={item}
              onClick={() => onNavigate(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </motion.nav>
  )
}

function DashboardPage({
  assistantPrompt,
  assistantResponse,
  category,
  dateRange,
  filteredInvoices,
  invoiceCategory,
  onAssistantPromptChange,
  onAssistantSubmit,
  onCategoryChange,
  onCrudAction,
  onDateRangeChange,
  onInvoiceCategoryChange,
  onNewInvoice,
  onStatusFilter,
  statusFilter,
}: {
  assistantPrompt: string
  assistantResponse: string
  category: string
  dateRange: string
  filteredInvoices: Array<Invoice>
  invoiceCategory: string
  onAssistantPromptChange: (value: string) => void
  onAssistantSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onCategoryChange: (value: string) => void
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
  onDateRangeChange: (value: string) => void
  onInvoiceCategoryChange: (category: string) => void
  onNewInvoice: () => void
  onStatusFilter: (status: 'All' | InvoiceStatus) => void
  statusFilter: 'All' | InvoiceStatus
}) {
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.37fr)]">
      <div className="flex flex-col gap-4">
        <DashboardHeader
          category={category}
          dateRange={dateRange}
          onCategoryChange={onCategoryChange}
          onDateRangeChange={onDateRangeChange}
          onNewInvoice={onNewInvoice}
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <MotionCard className="min-h-[420px] p-4 sm:p-5" index={1}>
            <SalesTrackingCard dateRange={dateRange} />
          </MotionCard>

          <div className="grid gap-4">
            <MotionCard className="p-4 sm:p-5" index={2}>
              <AssistantCard
                assistantPrompt={assistantPrompt}
                assistantResponse={assistantResponse}
                onPromptChange={onAssistantPromptChange}
                onSubmit={onAssistantSubmit}
              />
            </MotionCard>
            <MotionCard className="p-4 sm:p-5" index={3}>
              <OrderTimeTrackingCard onCrudAction={onCrudAction} />
            </MotionCard>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.82fr_1.18fr]">
          <MotionCard className="p-4 sm:p-5" index={4}>
            <MarketDemandCard category={category} />
          </MotionCard>
          <MotionCard className="p-4 sm:p-5" index={5}>
            <WarehouseCard onCrudAction={onCrudAction} />
          </MotionCard>
        </div>
      </div>

      <aside className="grid gap-4 lg:auto-rows-min">
        <div className="grid auto-cols-[minmax(165px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible">
          {kpis.map((kpi, index) => (
            <MotionCard className="min-w-[165px] p-4" index={index + 2} key={kpi.label}>
              <KpiCard {...kpi} onCrudAction={onCrudAction} />
            </MotionCard>
          ))}
        </div>

        <MotionCard className="p-4 sm:p-5" index={6}>
          <InvoiceListCard
            invoiceCategory={invoiceCategory}
            invoices={filteredInvoices}
            onCrudAction={onCrudAction}
            onInvoiceCategoryChange={onInvoiceCategoryChange}
            onStatusFilter={onStatusFilter}
            statusFilter={statusFilter}
          />
        </MotionCard>
      </aside>
    </section>
  )
}

function DashboardHeader({
  category,
  dateRange,
  onCategoryChange,
  onDateRangeChange,
  onNewInvoice,
}: {
  category: string
  dateRange: string
  onCategoryChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onNewInvoice: () => void
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
      <div>
        <h1 className="whitespace-nowrap text-[clamp(2rem,4.2vw,4.5rem)] font-medium leading-none tracking-[-0.06em] text-cream">
          Point of Sales Overview
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        <StyledSelect
          icon={CalendarDays}
          onValueChange={onDateRangeChange}
          options={dateRangeOptions}
          value={dateRange}
        />
        <StyledSelect
          icon={SlidersHorizontal}
          onValueChange={onCategoryChange}
          options={marketCategoryOptions}
          value={category}
        />
        <Button onClick={onNewInvoice}>
          <Plus />
          New invoice
        </Button>
        <p className="basis-full text-right text-[0.68rem] text-muted xl:basis-auto">Updated 2 min ago</p>
      </div>
    </div>
  )
}

function SalesTrackingCard({ dateRange }: { dateRange: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">Earnings</p>
          <h2 className="mt-1 text-xl font-medium text-cream">Tracking our sales</h2>
        </div>
        <div className="rounded border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-xs font-medium text-cream/75">
          {dateRange}
        </div>
      </div>

      <div className="mt-6 grid flex-1 grid-cols-[auto_1fr] gap-4">
        <div className="flex flex-col justify-between py-3 text-[0.68rem] font-medium text-muted">
          <span>$70k</span>
          <span>$50k</span>
          <span>$30k</span>
          <span>$10k</span>
        </div>

        <div className="relative flex min-h-[260px] items-end gap-2 rounded-2xl border border-white/[0.04] bg-black/10 p-3">
          <div className="absolute inset-x-3 top-1/4 border-t border-dashed border-white/[0.05]" />
          <div className="absolute inset-x-3 top-1/2 border-t border-dashed border-white/[0.05]" />
          <div className="absolute inset-x-3 top-3/4 border-t border-dashed border-white/[0.05]" />
          {salesData.map((item, index) => (
            <div className="group relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-2" key={item.day}>
              <div className="absolute -top-12 hidden rounded-xl border border-orange-200/15 bg-coffee px-2 py-1 text-[0.65rem] text-cream shadow-xl group-hover:block">
                ${item.sales}k
              </div>
              <motion.div
                className={cn(
                  'w-full rounded bg-white/[0.07] transition group-hover:opacity-60',
                  item.sales > 80 &&
                    'bg-[linear-gradient(180deg,#f47b3f,#b83512)] shadow-[0_0_24px_rgba(242,106,46,0.42)] group-hover:opacity-100',
                )}
                initial={{ height: 0 }}
                animate={{ height: `${item.sales}%` }}
                transition={{ delay: 0.2 + index * 0.045, duration: 0.8, ease: premiumEase }}
              />
              <span className="text-[0.62rem] text-muted">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted">Total sales</p>
          <p className="text-3xl font-medium tracking-[-0.05em] text-cream">$58.4k</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted">
          <Legend color="bg-orange-400" label="Transaction" />
          <Legend color="bg-emerald-400" label="Repeat order" />
          <Legend color="bg-white/20" label="Baseline" />
        </div>
      </div>
    </div>
  )
}

function MarketDemandCard({ category }: { category: string }) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Market demand</p>
          <p className="mt-1 text-3xl font-medium tracking-[-0.05em] text-cream">3.048 items</p>
        </div>
        <span className="rounded border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-cream/70">
          {category}
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {marketDemand.map((item) => (
          <div key={item.category}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-cream/85">{item.category}</span>
              <span className="text-muted">{item.helper}</span>
            </div>
            <div className="h-2 rounded bg-white/[0.06]">
              <motion.div
                animate={{ width: `${item.value}%` }}
                className={cn('h-full rounded shadow-[0_0_18px_rgba(242,106,46,0.22)]', item.color)}
                initial={{ width: 0 }}
                transition={{ duration: 0.8, ease: premiumEase }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrderTimeTrackingCard({
  onCrudAction,
}: {
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">Order time tracking</p>
          <p className="mt-1 text-3xl font-medium tracking-[-0.05em] text-cream">+720</p>
          <p className="text-xs text-emerald-200">Grow since last month</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-cream/70" type="button">
          Weekly
          <ChevronDown className="size-3" />
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[0.62rem] text-muted">
          {dayLabels.map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {heatmap.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'aspect-square rounded-md border border-white/[0.03] bg-white/[0.04]',
                  value === 1 && 'bg-orange-400/10',
                  value === 2 && 'bg-orange-400/20',
                  value === 3 && 'bg-orange-400/35',
                  value === 4 && 'bg-orange-400/55 shadow-[0_0_14px_rgba(242,106,46,0.15)]',
                  value === 5 && 'bg-orange-400 shadow-[0_0_18px_rgba(242,106,46,0.35)]',
                )}
                initial={{ opacity: 0, scale: 0.88 }}
                key={`${rowIndex}-${colIndex}`}
                transition={{ delay: 0.1 + (rowIndex + colIndex) * 0.025, duration: 0.35 }}
              />
            )),
          )}
        </div>
      </div>

      <Button
        className="mt-5 w-full"
        onClick={() =>
          onCrudAction('report', 'report', 'Create order activity report', 'Generate a weekly report from order heatmap intensity, growth, and channel activity.')
        }
        size="sm"
      >
        Create report
        <ArrowUpRight />
      </Button>
    </div>
  )
}

function AssistantCard({
  assistantPrompt,
  assistantResponse,
  onPromptChange,
  onSubmit,
}: {
  assistantPrompt: string
  assistantResponse: string
  onPromptChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded bg-orange-400/15 text-orange-200">
          <MessageCircle className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-cream">Can I help you?</h2>
          <p className="text-xs text-muted">{assistantResponse}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {assistantActions.map((action) => (
          <button
            className="rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-medium text-cream/70 transition hover:border-orange-300/20 hover:text-cream"
            key={action}
            onClick={() => onPromptChange(action)}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>

      <form className="mt-4 flex items-center gap-2 rounded border border-white/10 bg-black/20 p-1.5 focus-within:border-orange-300/35" onSubmit={onSubmit}>
        <input
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-cream outline-none placeholder:text-muted"
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Ask something to AI"
          value={assistantPrompt}
        />
        <Button size="icon" type="submit">
          <Send />
        </Button>
      </form>
    </div>
  )
}

function KpiCard({
  change,
  icon: Icon,
  label,
  onCrudAction,
  value,
}: {
  change: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
  value: string
}) {
  const isNegative = change.startsWith('-')

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex size-9 items-center justify-center rounded bg-white/[0.06] text-orange-200">
          <Icon className="size-4" />
        </div>
        <button
          className="text-muted transition hover:text-orange-100"
          onClick={() => onCrudAction('view', 'insight', `${label} detail`, `Open the operational drill-down for ${label.toLowerCase()}.`)}
          type="button"
        >
          <ArrowUpRight className="size-4" />
        </button>
      </div>
      <p className="mt-4 text-xs font-medium text-muted">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <p className="text-2xl font-medium tracking-[-0.05em] text-cream">{value}</p>
        <StatusBadge status={isNegative ? 'Neutral' : 'Positive'}>{change}</StatusBadge>
      </div>
    </div>
  )
}

function InvoiceListCard({
  invoiceCategory,
  invoices,
  onCrudAction,
  onInvoiceCategoryChange,
  onStatusFilter,
  statusFilter,
}: {
  invoiceCategory: string
  invoices: Array<Invoice>
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
  onInvoiceCategoryChange: (category: string) => void
  onStatusFilter: (status: 'All' | InvoiceStatus) => void
  statusFilter: 'All' | InvoiceStatus
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-cream">Invoice</h2>
          <p className="text-xs text-muted">Recent customer</p>
        </div>
        <StyledSelect
          className="h-8 min-w-[124px] px-2 text-xs"
          onValueChange={onInvoiceCategoryChange}
          options={invoiceCategoryOptions}
          value={invoiceCategory}
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(['All', 'Waiting', 'Delivered', 'Decline'] as const).map((status) => (
          <button
            className={cn(
              'rounded border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-medium text-cream/65 transition hover:text-cream',
              statusFilter === status && 'border-orange-300/30 bg-orange-400/15 text-orange-100',
            )}
            key={status}
            onClick={() => onStatusFilter(status)}
            type="button"
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted">
            No invoices match this status.
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-transparent p-2 transition hover:border-orange-300/10 hover:bg-white/[0.04]"
              key={invoice.id}
            >
              <div className="flex size-10 items-center justify-center rounded bg-cream/10 text-xs font-medium text-cream transition group-hover:scale-105">
                {invoice.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-cream">{invoice.customerName}</p>
                <p className="truncate text-[0.68rem] text-muted">
                  {invoice.customerType} - {invoice.createdAt}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={invoice.status} />
                <p className="mt-1 text-xs font-medium text-cream">{formatCurrency(invoice.amount)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        className="mt-4 w-full rounded border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-cream/70 transition hover:border-orange-300/20 hover:text-cream"
        onClick={() => onCrudAction('view', 'invoice', 'View all invoices', 'Review, filter, edit, and reconcile the complete invoice queue.')}
        type="button"
      >
        View all invoices
      </button>
    </div>
  )
}

function WarehouseCard({
  onCrudAction,
}: {
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
}) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Warehouse</p>
          <h2 className="mt-1 text-xl font-medium text-cream">Outbound route active</h2>
        </div>
        <button
          className="text-orange-200 transition hover:text-orange-100"
          onClick={() => onCrudAction('edit', 'warehouse', 'Update warehouse route', 'Adjust handler, route checkpoints, ETA, and fulfillment priority.')}
          type="button"
        >
          <Warehouse className="size-5" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative h-20 rounded-2xl border border-white/[0.05] bg-black/15 p-4">
          <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-white/10" />
          <div className="absolute left-6 top-1/2 size-3 -translate-y-1/2 rounded bg-emerald-300 shadow-[0_0_16px_rgba(92,199,121,0.45)]" />
          <motion.div
            animate={{ left: '58%' }}
            className="absolute top-1/2 size-5 -translate-y-1/2 rounded border-4 border-coffee bg-orange-400 shadow-[0_0_20px_rgba(242,106,46,0.55)]"
            initial={{ left: '20%' }}
            transition={{ duration: 1.2, ease: premiumEase }}
          />
          <div className="absolute right-6 top-1/2 size-3 -translate-y-1/2 rounded bg-white/30" />
        </div>

        <div className="min-w-[180px] space-y-3">
          <InfoLine icon={MapPin} label="Location" value="Dock B to Midtown" />
          <InfoLine icon={UserRound} label="Handler" value="Jordan Miles" />
          <InfoLine icon={Clock3} label="ETA" value="18 min" />
        </div>
      </div>
    </div>
  )
}

function AnalyticsPage({
  onCrudAction,
}: {
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
}) {
  return (
    <section className="mt-6 grid gap-4">
      <PageHeader
        actionLabel="Create report"
        icon={BarChart3}
        onAction={() => onCrudAction('report', 'report', 'Create analytics report', 'Build a revenue, product, and customer performance report for the selected period.')}
        subtitle="Revenue, conversion, demand, and refund intelligence."
        title="Analytics"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsSegments.map((segment, index) => (
          <MotionCard className="p-4" index={index + 1} key={segment.label}>
            <KpiCard {...segment} onCrudAction={onCrudAction} />
          </MotionCard>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <MotionCard className="p-5" index={5}>
          <SectionTitle
            actionLabel="Export insight"
            onAction={() => onCrudAction('export', 'insight', 'Export analytics insight', 'Choose export format, recipients, cadence, and included metrics.')}
            title="Sales performance by channel"
          />
          <div className="mt-6 grid min-h-[330px] grid-cols-12 items-end gap-3 rounded-2xl border border-white/[0.04] bg-black/10 p-4">
            {salesData.map((item) => (
              <div className="flex h-full flex-col justify-end gap-2" key={item.day}>
                <div className="rounded bg-orange-400/80 shadow-[0_0_22px_rgba(242,106,46,0.22)]" style={{ height: `${item.sales}%` }} />
                <span className="text-center text-[0.62rem] text-muted">{item.day}</span>
              </div>
            ))}
          </div>
        </MotionCard>
        <MotionCard className="p-5" index={6}>
          <SectionTitle
            actionLabel="Configure KPI"
            onAction={() => onCrudAction('edit', 'insight', 'Configure KPI tracking', 'Select thresholds, owners, alert rules, and visible KPI cards.')}
            title="Demand signals"
          />
          <div className="mt-6 space-y-4">
            {marketDemand.map((item) => (
              <div className="rounded border border-white/10 bg-white/[0.03] p-4" key={item.category}>
                <div className="mb-3 flex justify-between text-sm">
                  <span className="font-medium text-cream">{item.category}</span>
                  <span className="text-muted">{item.helper}</span>
                </div>
                <div className="h-3 rounded bg-white/[0.06]">
                  <div className={cn('h-full rounded', item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </MotionCard>
      </div>
    </section>
  )
}

function InvoicesPage({
  invoiceCategory,
  invoices,
  onCrudAction,
  onInvoiceCategoryChange,
  onNewInvoice,
  onStatusFilter,
  statusFilter,
}: {
  invoiceCategory: string
  invoices: Array<Invoice>
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
  onInvoiceCategoryChange: (category: string) => void
  onNewInvoice: () => void
  onStatusFilter: (status: 'All' | InvoiceStatus) => void
  statusFilter: 'All' | InvoiceStatus
}) {
  return (
    <section className="mt-6 grid gap-4">
      <PageHeader
        actionLabel="New invoice"
        icon={FileText}
        onAction={onNewInvoice}
        subtitle="Manage invoice creation, status review, and payment follow-up."
        title="Invoices"
      />
      <MotionCard className="p-5" index={1}>
        <InvoiceListCard
          invoiceCategory={invoiceCategory}
          invoices={invoices}
          onCrudAction={onCrudAction}
          onInvoiceCategoryChange={onInvoiceCategoryChange}
          onStatusFilter={onStatusFilter}
          statusFilter={statusFilter}
        />
        <div className="mt-5 grid gap-2">
          {invoices.map((invoice) => (
            <ActionRow
              description={`${invoice.customerType} - ${invoice.createdAt} - ${formatCurrency(invoice.amount)}`}
              key={invoice.id}
              onDelete={() => onCrudAction('delete', 'invoice', `Delete ${invoice.id}`, `Confirm removal for ${invoice.customerName}'s invoice.`)}
              onEdit={() => onCrudAction('edit', 'invoice', `Edit ${invoice.id}`, `Update customer, amount, status, and payment notes for ${invoice.customerName}.`)}
              onView={() => onCrudAction('view', 'invoice', `View ${invoice.id}`, `Inspect status history, customer data, payment amount, and fulfillment linkage.`)}
              title={invoice.customerName}
            />
          ))}
        </div>
      </MotionCard>
    </section>
  )
}

function CalendarPage({
  onCrudAction,
}: {
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
}) {
  return (
    <section className="mt-6 grid gap-4">
      <PageHeader
        actionLabel="Schedule event"
        icon={CalendarPlus}
        onAction={() => onCrudAction('schedule', 'event', 'Schedule operation event', 'Create a stock count, invoice review, shipment, or promotion calendar event.')}
        subtitle="Coordinate stock counts, shipments, invoice reviews, and campaigns."
        title="Calendar"
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <MotionCard className="p-5" index={1}>
          <SectionTitle title="May operations" />
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, index) => (
              <button
                className={cn(
                  'aspect-square rounded border border-white/10 bg-white/[0.03] text-sm text-muted transition hover:border-orange-300/20 hover:text-cream',
                  [6, 14, 18, 23, 28].includes(index) && 'bg-orange-400/15 text-orange-100',
                )}
                key={index}
                onClick={() => onCrudAction('view', 'event', `View day ${index + 1}`, 'Review scheduled operations and related POS dependencies for this day.')}
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>
        </MotionCard>
        <MotionCard className="p-5" index={2}>
          <SectionTitle title="Today schedule" />
          <div className="mt-5 space-y-3">
            {calendarEvents.map((event) => (
              <ActionRow
                description={`${event.type} - ${event.owner} - ${event.time}`}
                key={event.id}
                onDelete={() => onCrudAction('delete', 'event', `Cancel ${event.title}`, 'Cancel this scheduled operation and notify owners.')}
                onEdit={() => onCrudAction('edit', 'event', `Edit ${event.title}`, 'Change time, owner, event type, reminders, and module linkage.')}
                onView={() => onCrudAction('view', 'event', event.title, 'Open the complete operation event details.')}
                title={event.title}
              />
            ))}
          </div>
        </MotionCard>
      </div>
    </section>
  )
}

function ProductsPage({
  onCrudAction,
}: {
  onCrudAction: (intent: CrudIntent, entity: CrudEntity, title: string, description: string) => void
}) {
  return (
    <section className="mt-6 grid gap-4">
      <PageHeader
        actionLabel="Add product"
        icon={PackagePlus}
        onAction={() => onCrudAction('create', 'product', 'Add product', 'Create product details, pricing, stock thresholds, and fulfillment settings.')}
        subtitle="Control catalog data, stock status, pricing, and restock actions."
        title="Products"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product, index) => (
          <MotionCard className="p-4" index={index + 1} key={product.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted">{product.id}</p>
                <h2 className="mt-1 text-lg font-medium text-cream">{product.name}</h2>
              </div>
              <Boxes className="size-5 text-orange-200" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <InfoMetric label="Stock" value={String(product.stock)} />
              <InfoMetric label="Price" value={formatCurrency(product.price)} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <StatusBadge status={product.status === 'In stock' ? 'Delivered' : product.status === 'Low stock' ? 'Waiting' : 'Decline'}>
                {product.status}
              </StatusBadge>
              <button
                className="rounded border border-orange-300/20 bg-orange-400/10 px-3 py-1.5 text-xs text-orange-100"
                onClick={() => onCrudAction('restock', 'product', `Restock ${product.name}`, 'Create a restock request, supplier note, and warehouse receiving target.')}
                type="button"
              >
                Restock
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <IconAction icon={Eye} label="View" onClick={() => onCrudAction('view', 'product', product.name, 'Open SKU, pricing, stock, sales, and movement details.')} />
              <IconAction icon={Edit3} label="Edit" onClick={() => onCrudAction('edit', 'product', `Edit ${product.name}`, 'Update product data, category, pricing, and reorder thresholds.')} />
              <IconAction icon={Trash2} label="Delete" onClick={() => onCrudAction('delete', 'product', `Delete ${product.name}`, 'Confirm product archive and downstream inventory effects.')} />
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  )
}

function NewInvoiceSheet({
  errors,
  form,
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
}: {
  errors: Partial<Record<keyof NewInvoiceForm, string>>
  form: NewInvoiceForm
  isOpen: boolean
  onClose: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onUpdate: <TKey extends keyof NewInvoiceForm>(key: TKey, value: NewInvoiceForm[TKey]) => void
}) {
  return (
    <Sheet onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <SheetContent side="right" title="Create new invoice">
        <SheetHeader>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-200/75">Invoice CRUD</p>
          <h2 className="mt-1 text-2xl font-medium tracking-[-0.04em] text-cream">Create new invoice</h2>
          <p className="text-sm text-muted">Add a recent customer invoice to the POS operations queue.</p>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
          <SheetBody className="space-y-4">
            <FormField error={errors.customerName} label="Customer name">
              <input
                className="field-input"
                onChange={(event) => onUpdate('customerName', event.target.value)}
                placeholder="Sarah Johnson"
                value={form.customerName}
              />
            </FormField>
            <FormField error={errors.customerType} label="Customer category">
              <input
                className="field-input"
                onChange={(event) => onUpdate('customerType', event.target.value)}
                placeholder="Fashion retail"
                value={form.customerType}
              />
            </FormField>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField error={errors.amount} label="Amount">
                <input
                  className="field-input"
                  inputMode="decimal"
                  onChange={(event) => onUpdate('amount', event.target.value)}
                  placeholder="1240"
                  value={form.amount}
                />
              </FormField>
              <FormField label="Payment status">
                <StyledSelect
                  className="h-11 w-full"
                  onValueChange={(value) => onUpdate('status', value as InvoiceStatus)}
                  options={invoiceStatusOptions}
                  value={form.status}
                />
              </FormField>
            </div>
            <div className="rounded border border-orange-300/10 bg-orange-400/5 p-4 text-sm text-muted">
              Creating this invoice updates the recent invoice list, KPI totals, and customer payment status surface.
            </div>
          </SheetBody>
          <SheetFooter>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button onClick={onClose} type="button" variant="secondary">
                Close
              </Button>
              <Button type="submit">
                <Check />
                Create invoice
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function CrudActionSheet({ onClose, sheet }: { onClose: () => void; sheet: CrudSheetState | null }) {
  const primaryLabel =
    sheet?.intent === 'delete'
      ? 'Confirm delete'
      : sheet?.intent === 'export'
        ? 'Export'
        : sheet?.intent === 'restock'
          ? 'Create restock'
          : sheet?.intent === 'view'
            ? 'Open record'
            : 'Save action'

  return (
    <Sheet onOpenChange={(open) => !open && onClose()} open={Boolean(sheet)}>
      <SheetContent side="right" title={sheet?.title ?? 'Action sheet'}>
        <SheetHeader>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-orange-200/75">
            {sheet?.entity ?? 'module'} / {sheet?.intent ?? 'action'}
          </p>
          <h2 className="mt-1 text-2xl font-medium tracking-[-0.04em] text-cream">{sheet?.title}</h2>
          <p className="text-sm text-muted">{sheet?.description}</p>
        </SheetHeader>
        <SheetBody className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoMetric label="Owner" value="Operations desk" />
            <InfoMetric label="Priority" value={sheet?.intent === 'delete' ? 'Needs approval' : 'Normal'} />
          </div>
          <FormField label="Action name">
            <input className="field-input" defaultValue={sheet?.title ?? ''} placeholder="Action name" />
          </FormField>
          <FormField label="Notes">
            <textarea
              className="field-input min-h-28 resize-none py-3"
              defaultValue={sheet?.description ?? ''}
              placeholder="Add internal notes, customer context, or operational dependencies."
            />
          </FormField>
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-medium text-cream">Linked module impact</h3>
            <div className="mt-3 grid gap-2 text-sm text-muted">
              <span>Invoices update finance and customer payment state.</span>
              <span>Products update stock, warehouse, and sales availability.</span>
              <span>Calendar actions notify owners and affect daily operations.</span>
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button onClick={onClose} type="button" variant="secondary">
              Close
            </Button>
            <Button onClick={onClose} type="button" variant={sheet?.intent === 'delete' ? 'secondary' : 'default'}>
              {sheet?.intent === 'export' ? <Download /> : <Check />}
              {primaryLabel}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function PageHeader({
  actionLabel,
  icon: Icon,
  onAction,
  subtitle,
  title,
}: {
  actionLabel: string
  icon: React.ComponentType<{ className?: string }>
  onAction: () => void
  subtitle: string
  title: string
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <div className="mb-3 flex size-11 items-center justify-center rounded border border-orange-300/10 bg-orange-400/10 text-orange-200">
          <Icon className="size-5" />
        </div>
        <h1 className="text-[clamp(2rem,4vw,4.25rem)] font-medium leading-none tracking-[-0.06em] text-cream">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">{subtitle}</p>
      </div>
      <Button onClick={onAction}>
        <Plus />
        {actionLabel}
      </Button>
    </div>
  )
}

function SectionTitle({
  actionLabel,
  onAction,
  title,
}: {
  actionLabel?: string
  onAction?: () => void
  title: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-medium text-cream">{title}</h2>
      {actionLabel && onAction ? (
        <Button onClick={onAction} size="sm" variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

function ActionRow({
  description,
  onDelete,
  onEdit,
  onView,
  title,
}: {
  description: string
  onDelete: () => void
  onEdit: () => void
  onView: () => void
  title: string
}) {
  return (
    <div className="grid gap-3 rounded border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-cream">{title}</p>
        <p className="truncate text-xs text-muted">{description}</p>
      </div>
      <div className="flex gap-2">
        <IconAction icon={Eye} label="View" onClick={onView} />
        <IconAction icon={Edit3} label="Edit" onClick={onEdit} />
        <IconAction icon={Trash2} label="Delete" onClick={onDelete} />
      </div>
    </div>
  )
}

function InfoMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[0.65rem] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-lg font-medium text-cream">{value}</p>
    </div>
  )
}

function IconAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-cream/65 transition hover:border-orange-300/20 hover:text-cream"
      onClick={onClick}
      type="button"
    >
      <Icon className="size-4" />
    </button>
  )
}

function MotionCard({
  children,
  className,
  index,
}: {
  children: React.ReactNode
  className?: string
  index: number
}) {
  return (
    <GlassCard as={motion.section} className={className} custom={index} initial="hidden" variants={cardVariants} whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
      {children}
    </GlassCard>
  )
}

function FormField({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-medium text-cream/75">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-200">{error}</span> : null}
    </div>
  )
}

function IconPill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button
      aria-label={label}
      className="flex size-9 items-center justify-center rounded border border-white/[0.06] bg-white/[0.04] text-cream/65 transition hover:text-cream"
      type="button"
    >
      <Icon className="size-4" />
    </button>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-8 items-center justify-center rounded bg-white/[0.05] text-orange-200">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="text-xs font-medium text-cream">{value}</p>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('size-2 rounded', color)} />
      {label}
    </span>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}
