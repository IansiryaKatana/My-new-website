export type OrderType = 'dine_in' | 'delivery' | 'takeaway' | 'scheduled'
export type OrderStatus = 'completed' | 'in_progress' | 'ready' | 'cancelled'

export interface OrderItem {
  id: string
  name: string
  description: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerType: string
  type: OrderType
  items: OrderItem[]
  time: string
  date: string
  amount: number
  status: OrderStatus
  deliveryAddress?: string
  notes?: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  available: boolean
}

export interface RestaurantTable {
  id: string
  name: string
  seats: number
  status: 'available' | 'occupied' | 'reserved'
}

export interface Customer {
  id: string
  name: string
  phone: string
  totalOrders: number
  loyaltyTier: 'bronze' | 'silver' | 'gold'
}

export interface InventoryItem {
  id: string
  name: string
  stock: number
  unit: string
  minStock: number
}

export interface Report {
  id: string
  title: string
  period: 'today' | 'week' | 'month'
  notes: string
}
