import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  seedCustomers,
  seedInventory,
  seedMenu,
  seedOrders,
  seedReports,
  seedTables,
} from './seed'
import type {
  Customer,
  InventoryItem,
  MenuItem,
  Order,
  Report,
  RestaurantTable,
} from './types'

type AppState = {
  orders: Order[]
  setOrders: (items: Order[]) => void
  menu: MenuItem[]
  setMenu: (items: MenuItem[]) => void
  tables: RestaurantTable[]
  setTables: (items: RestaurantTable[]) => void
  customers: Customer[]
  setCustomers: (items: Customer[]) => void
  inventory: InventoryItem[]
  setInventory: (items: InventoryItem[]) => void
  reports: Report[]
  setReports: (items: Report[]) => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(seedOrders)
  const [menu, setMenu] = useState<MenuItem[]>(seedMenu)
  const [tables, setTables] = useState<RestaurantTable[]>(seedTables)
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers)
  const [inventory, setInventory] = useState<InventoryItem[]>(seedInventory)
  const [reports, setReports] = useState<Report[]>(seedReports)

  const value = useMemo(
    () => ({
      orders,
      setOrders,
      menu,
      setMenu,
      tables,
      setTables,
      customers,
      setCustomers,
      inventory,
      setInventory,
      reports,
      setReports,
    }),
    [customers, inventory, menu, orders, reports, tables],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
