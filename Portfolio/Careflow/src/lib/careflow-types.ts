export type PaymentStatus = 'Paid' | 'Unpaid' | 'Insurance'
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled'
export type ConsultationStatus = 'Live' | 'Scheduled' | 'Ended'
export type SenderRole = 'Patient' | 'Doctor' | 'Care Team'

export type UserProfile = {
  id: string
  name: string
  age: number
  email: string
  phone: string
  avatarUrl: string
  carePlan: 'Free' | 'Pro'
}

export type Appointment = {
  id: string
  specialist: string
  doctorName: string
  date: string
  time: string
  reason: string
  paymentStatus: PaymentStatus
  status: AppointmentStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export type Consultation = {
  id: string
  doctorName: string
  specialty: string
  duration: string
  status: ConsultationStatus
  appointmentId?: string
  startedAt: string
  patientVideoEnabled: boolean
  patientMicEnabled: boolean
}

export type Message = {
  id: string
  sender: SenderRole
  body: string
  sentAt: string
  read: boolean
}

export type Conversation = {
  id: string
  title: string
  doctorName: string
  specialty: string
  status: 'Open' | 'Closed'
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export type HealthMetric = {
  id: string
  date: string
  weightKg: number
  heartRateBpm: number
  bloodGlucoseMmol: number
  systolic: number
  diastolic: number
  oxygenSaturation: number
  notes: string
  createdAt: string
  updatedAt: string
}

export type Subscription = {
  plan: 'Free' | 'Pro'
  renewsAt: string
  priorityConsultations: boolean
  personalizedGuidance: boolean
}

export type CareFlowDatabase = {
  user: UserProfile
  appointments: Appointment[]
  consultations: Consultation[]
  conversations: Conversation[]
  healthMetrics: HealthMetric[]
  subscription: Subscription
}

export type AppointmentInput = Omit<
  Appointment,
  'id' | 'createdAt' | 'updatedAt'
>

export type ConversationInput = {
  title: string
  doctorName: string
  specialty: string
  status: Conversation['status']
}

export type MessageInput = {
  conversationId: string
  sender: SenderRole
  body: string
  read?: boolean
}

export type HealthMetricInput = Omit<
  HealthMetric,
  'id' | 'createdAt' | 'updatedAt'
>

export type UserProfileInput = Omit<UserProfile, 'id' | 'avatarUrl'>
