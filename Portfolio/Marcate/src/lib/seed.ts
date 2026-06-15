import type {
  Customer,
  InventoryItem,
  MenuItem,
  Order,
  Report,
  RestaurantTable,
} from './types'

export const seedOrders: Order[] = [
  {
    id: '#7821',
    customerName: 'Sarah Mitchell',
    customerPhone: '+1 (555) 012-3450',
    customerType: 'Regular customer',
    type: 'dine_in',
    items: [{ id: '1', name: 'Pasta Alfredo', description: 'Extra parmesan', quantity: 2, price: 34.25 }],
    time: '12:34 PM',
    date: 'Apr 13',
    amount: 68.5,
    status: 'completed',
  },
  {
    id: '#7820',
    customerName: 'James Rodriguez',
    customerPhone: '+1 (555) 012-3456',
    customerType: 'Regular customer',
    type: 'delivery',
    items: [
      { id: '2', name: 'Grilled Salmon', description: 'Lemon butter sauce', quantity: 1, price: 18.9 },
      { id: '3', name: 'Caesar Salad', description: 'Extra dressing', quantity: 1, price: 12.3 },
      { id: '4', name: 'Sparkling Water', description: '500ml bottle', quantity: 2, price: 3 },
    ],
    time: '12:28 PM',
    date: 'Apr 13',
    amount: 39.64,
    status: 'in_progress',
    deliveryAddress: '142 Oak St, Apt 3B, New York, NY 10001',
    notes: 'No onions. Extra lemon on the side.',
  },
]

export const seedMenu: MenuItem[] = [
  { id: 'M1', name: 'Grilled Salmon', category: 'Main Course', price: 18.9, available: true },
  { id: 'M2', name: 'Caesar Salad', category: 'Salads', price: 12.3, available: true },
]

export const seedTables: RestaurantTable[] = [
  { id: 'T1', name: 'Table 1', seats: 4, status: 'occupied' },
  { id: 'T2', name: 'Table 2', seats: 2, status: 'available' },
]

export const seedCustomers: Customer[] = [
  { id: 'C1', name: 'James Rodriguez', phone: '+1 (555) 012-3456', totalOrders: 15, loyaltyTier: 'gold' },
  { id: 'C2', name: 'Sarah Mitchell', phone: '+1 (555) 012-3450', totalOrders: 8, loyaltyTier: 'silver' },
]

export const seedInventory: InventoryItem[] = [
  { id: 'I1', name: 'Salmon Fillet', stock: 24, unit: 'kg', minStock: 10 },
  { id: 'I2', name: 'Lettuce', stock: 12, unit: 'kg', minStock: 8 },
]

export const seedReports: Report[] = [
  { id: 'R1', title: 'Daily Operations', period: 'today', notes: 'Focus on pending deliveries' },
  { id: 'R2', title: 'Weekly Revenue Summary', period: 'week', notes: 'Revenue is up 8.7%' },
]
