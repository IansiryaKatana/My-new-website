import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { DashboardLayout } from '../components/dashboard-layout'
import { Badge, Button, Card, CrudDialog, Input } from '../components/ui'
import { useAppState } from '../lib/app-state'
import type { Order, OrderStatus, OrderType } from '../lib/types'
import { formatCurrency } from '../lib/utils'

export const Route = createFileRoute('/orders')({ component: OrdersPage })

function OrdersPage() {
  const { orders, setOrders } = useAppState()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(orders[0]?.id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState<Order>({
    id: '',
    customerName: '',
    customerPhone: '',
    customerType: 'Regular customer',
    type: 'delivery',
    items: [],
    time: '12:00 PM',
    date: 'Apr 13',
    amount: 0,
    status: 'in_progress',
  })

  const filtered = useMemo(
    () => orders.filter((o) => `${o.id} ${o.customerName}`.toLowerCase().includes(query.toLowerCase())),
    [orders, query],
  )

  const selected = orders.find((order) => order.id === selectedId) ?? orders[0]

  function saveOrder() {
    const amount = Number(draft.amount)
    const next = { ...draft, amount, id: draft.id || `#${Math.floor(Math.random() * 9000) + 1000}` }
    setOrders([next, ...orders.filter((order) => order.id !== next.id)])
    setSelectedId(next.id)
    setDialogOpen(false)
  }

  function updateStatus(id: string, status: OrderStatus) {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  return (
    <DashboardLayout>
      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h1 className="mr-auto text-xl font-semibold">Orders</h1>
          <Input placeholder="Search orders..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
          <Button onClick={() => setDialogOpen(true)}>New Order</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="overflow-auto rounded-lg border border-[var(--border)]">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-[var(--muted)]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer border-t border-[var(--border)] hover:bg-slate-50"
                    onClick={() => setSelectedId(order.id)}
                  >
                    <td className="p-3 font-semibold text-indigo-800">{order.id}</td>
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3 capitalize">{order.type.replace('_', '-')}</td>
                    <td className="p-3">{order.time}</td>
                    <td className="p-3">{formatCurrency(order.amount)}</td>
                    <td className="p-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <Card className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Order Details</p>
                <Badge className="bg-emerald-50 text-emerald-700">Live</Badge>
              </div>
              <h2 className="text-xl font-bold text-indigo-900">{selected.id}</h2>
              <p className="mt-1 text-sm">{selected.customerName}</p>
              <p className="text-xs text-[var(--muted)]">{selected.customerPhone}</p>
              <div className="mt-3 space-y-2">
                {selected.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-[var(--muted)]">{item.description}</p>
                    </div>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-[var(--border)] pt-3">
                <p className="flex items-center justify-between text-sm">
                  <span>Total</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(selected.amount)}</span>
                </p>
              </div>
              <div className="mt-4 grid gap-2">
                <Button onClick={() => updateStatus(selected.id, 'ready')}>Mark as Ready</Button>
                <Button className="bg-white text-[var(--foreground)] ring-1 ring-[var(--border)] hover:bg-slate-100">
                  Print Receipt
                </Button>
                <Button className="bg-red-500 text-white" onClick={() => setOrders(orders.filter((o) => o.id !== selected.id))}>
                  Delete Order
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Card>

      <CrudDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Create / Update Order">
        <div className="space-y-3">
          <Input placeholder="Order ID (#7822)" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
          <Input
            placeholder="Customer Name"
            value={draft.customerName}
            onChange={(e) => setDraft({ ...draft, customerName: e.target.value })}
          />
          <Input
            placeholder="Customer Phone"
            value={draft.customerPhone}
            onChange={(e) => setDraft({ ...draft, customerPhone: e.target.value })}
          />
          <select
            className="h-9 w-full rounded-md border border-[var(--border)] px-3 text-sm"
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value as OrderType })}
          >
            <option value="dine_in">Dine-In</option>
            <option value="delivery">Delivery</option>
            <option value="takeaway">Takeaway</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select
            className="h-9 w-full rounded-md border border-[var(--border)] px-3 text-sm"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as OrderStatus })}
          >
            <option value="in_progress">In Progress</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Input
            type="number"
            placeholder="Amount"
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
          />
          <Button onClick={saveOrder} className="w-full">
            Save
          </Button>
        </div>
      </CrudDialog>
    </DashboardLayout>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const classes: Record<OrderStatus, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    ready: 'bg-teal-100 text-teal-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return <Badge className={classes[status]}>{status.replace('_', ' ')}</Badge>
}
