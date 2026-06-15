declare module 'lucide-react' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react'

  export type LucideProps = SVGProps<SVGSVGElement> & {
    absoluteStrokeWidth?: boolean
    size?: number | string
  }

  export type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

  export const ArrowUpRight: LucideIcon
  export const BarChart3: LucideIcon
  export const Bell: LucideIcon
  export const Boxes: LucideIcon
  export const CalendarDays: LucideIcon
  export const CalendarPlus: LucideIcon
  export const Check: LucideIcon
  export const ChevronDown: LucideIcon
  export const CircleDollarSign: LucideIcon
  export const Clock3: LucideIcon
  export const Download: LucideIcon
  export const Edit3: LucideIcon
  export const Eye: LucideIcon
  export const FileText: LucideIcon
  export const MapPin: LucideIcon
  export const Menu: LucideIcon
  export const MessageCircle: LucideIcon
  export const PackageCheck: LucideIcon
  export const PackagePlus: LucideIcon
  export const Plus: LucideIcon
  export const RotateCcw: LucideIcon
  export const Search: LucideIcon
  export const Send: LucideIcon
  export const Settings: LucideIcon
  export const ShoppingBag: LucideIcon
  export const SlidersHorizontal: LucideIcon
  export const Trash2: LucideIcon
  export const TrendingUp: LucideIcon
  export const Truck: LucideIcon
  export const UserRound: LucideIcon
  export const Users: LucideIcon
  export const Warehouse: LucideIcon
  export const X: LucideIcon
}
