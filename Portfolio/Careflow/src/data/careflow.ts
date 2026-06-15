export type PaymentStatus = 'Paid' | 'Unpaid' | 'Insurance'

export type NavItem = {
  id: 'dashboard' | 'calendar' | 'appointments' | 'chats' | 'statistics'
  label: string
}

export type User = {
  id: string
  name: string
  age: number
  avatarUrl: string
}

export type Consultation = {
  id: string
  doctorName: string
  specialty: string
  duration: string
  status: 'live' | 'scheduled' | 'ended'
}

export type Appointment = {
  id: string
  specialist: string
  date: string
  time: string
  reason: string
  paymentStatus: PaymentStatus
}

export type HealthMetrics = {
  weightKg: number
  tooltipWeightKg: number
  heartRateBpm: number
  bloodGlucoseMmol: string
  weightHistory: number[]
}

export type Subscription = {
  plan: 'Free' | 'Pro'
  title: string
  description: string
  upgradeAvailable: boolean
}

export type CareFlowDashboardData = {
  user: User
  navItems: NavItem[]
  consultation: Consultation
  appointments: Appointment[]
  metrics: HealthMetrics
  subscription: Subscription
}

export const careFlowDashboardData: CareFlowDashboardData = {
  user: {
    id: 'patient-diane-lara',
    name: 'Diane Lara',
    age: 29,
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
  navItems: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'chats', label: 'Chats' },
    { id: 'statistics', label: 'Statistics' },
  ],
  consultation: {
    id: 'live-consultation-scarlet-everett',
    doctorName: 'Scarlet Everett',
    specialty: 'General practitioner',
    duration: '02:15:43',
    status: 'live',
  },
  appointments: [
    {
      id: 'cardiologist-oct-14',
      specialist: 'Cardiologist',
      date: 'Oct 14, 2025',
      time: '2:00 PM',
      reason: 'General Consultation',
      paymentStatus: 'Paid',
    },
    {
      id: 'endocrinologist-oct-19',
      specialist: 'Endocrinologist',
      date: 'Oct 19, 2025',
      time: '10:30 AM',
      reason: 'Follow-up',
      paymentStatus: 'Unpaid',
    },
    {
      id: 'dermatologist-oct-20',
      specialist: 'Dermatologist',
      date: 'Oct 20, 2025',
      time: '1:30 PM',
      reason: 'Test Results Review',
      paymentStatus: 'Insurance',
    },
  ],
  metrics: {
    weightKg: 58,
    tooltipWeightKg: 64,
    heartRateBpm: 70,
    bloodGlucoseMmol: '4,5',
    weightHistory: [61, 62, 60, 64, 63, 59, 58],
  },
  subscription: {
    plan: 'Free',
    title: 'Pro Subscription',
    description:
      'Priority consultations with doctors and personalized health guidance.',
    upgradeAvailable: true,
  },
}
