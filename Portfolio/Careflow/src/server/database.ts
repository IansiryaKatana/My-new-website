import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { initialCareFlowDatabase } from '../lib/careflow-seed'
import type {
  Appointment,
  AppointmentInput,
  CareFlowDatabase,
  Conversation,
  ConversationInput,
  HealthMetric,
  HealthMetricInput,
  Message,
  MessageInput,
  Subscription,
  UserProfile,
  UserProfileInput,
} from '../lib/careflow-types'

const databasePath = resolve(process.cwd(), '.data', 'careflow-db.json')

export async function readDatabase(): Promise<CareFlowDatabase> {
  try {
    const database = await readFile(databasePath, 'utf-8')
    return JSON.parse(database) as CareFlowDatabase
  } catch {
    await writeDatabase(initialCareFlowDatabase)
    return initialCareFlowDatabase
  }
}

async function writeDatabase(database: CareFlowDatabase) {
  await mkdir(dirname(databasePath), { recursive: true })
  await writeFile(databasePath, JSON.stringify(database, null, 2))
}

async function updateDatabase(
  updater: (database: CareFlowDatabase) => CareFlowDatabase,
) {
  const database = await readDatabase()
  const updatedDatabase = updater(structuredClone(database))
  await writeDatabase(updatedDatabase)
  return updatedDatabase
}

function timestamp() {
  return new Date().toISOString()
}

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function requireText(value: string, label: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error(`${label} is required.`)
  }
  return trimmed
}

function requirePositiveNumber(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be greater than zero.`)
  }
  return value
}

function validateAppointment(input: AppointmentInput): AppointmentInput {
  return {
    specialist: requireText(input.specialist, 'Specialist'),
    doctorName: requireText(input.doctorName, 'Doctor name'),
    date: requireText(input.date, 'Date'),
    time: requireText(input.time, 'Time'),
    reason: requireText(input.reason, 'Reason'),
    paymentStatus: input.paymentStatus,
    status: input.status,
    notes: input.notes.trim(),
  }
}

function validateMetric(input: HealthMetricInput): HealthMetricInput {
  return {
    date: requireText(input.date, 'Date'),
    weightKg: requirePositiveNumber(Number(input.weightKg), 'Weight'),
    heartRateBpm: requirePositiveNumber(
      Number(input.heartRateBpm),
      'Heart rate',
    ),
    bloodGlucoseMmol: requirePositiveNumber(
      Number(input.bloodGlucoseMmol),
      'Blood glucose',
    ),
    systolic: requirePositiveNumber(Number(input.systolic), 'Systolic'),
    diastolic: requirePositiveNumber(Number(input.diastolic), 'Diastolic'),
    oxygenSaturation: requirePositiveNumber(
      Number(input.oxygenSaturation),
      'Oxygen saturation',
    ),
    notes: input.notes.trim(),
  }
}

export async function createAppointment(input: AppointmentInput) {
  const data = validateAppointment(input)
  const now = timestamp()
  const appointment: Appointment = {
    ...data,
    id: makeId('appt'),
    createdAt: now,
    updatedAt: now,
  }

  return updateDatabase((database) => ({
    ...database,
    appointments: [appointment, ...database.appointments],
  }))
}

export async function updateAppointment(
  input: AppointmentInput & { id: string },
) {
  const data = validateAppointment(input)
  return updateDatabase((database) => ({
    ...database,
    appointments: database.appointments.map((appointment) =>
      appointment.id === input.id
        ? { ...appointment, ...data, updatedAt: timestamp() }
        : appointment,
    ),
  }))
}

export async function deleteAppointment(id: string) {
  return updateDatabase((database) => ({
    ...database,
    appointments: database.appointments.filter(
      (appointment) => appointment.id !== id,
    ),
  }))
}

export async function updateConsultation(
  input: Partial<CareFlowDatabase['consultations'][number]> & { id: string },
) {
  return updateDatabase((database) => ({
    ...database,
    consultations: database.consultations.map((consultation) =>
      consultation.id === input.id ? { ...consultation, ...input } : consultation,
    ),
  }))
}

export async function createConversation(input: ConversationInput) {
  const now = timestamp()
  const conversation: Conversation = {
    id: makeId('thread'),
    title: requireText(input.title, 'Thread title'),
    doctorName: requireText(input.doctorName, 'Doctor name'),
    specialty: requireText(input.specialty, 'Specialty'),
    status: input.status,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }

  return updateDatabase((database) => ({
    ...database,
    conversations: [conversation, ...database.conversations],
  }))
}

export async function updateConversation(
  input: ConversationInput & { id: string },
) {
  return updateDatabase((database) => ({
    ...database,
    conversations: database.conversations.map((conversation) =>
      conversation.id === input.id
        ? {
            ...conversation,
            title: requireText(input.title, 'Thread title'),
            doctorName: requireText(input.doctorName, 'Doctor name'),
            specialty: requireText(input.specialty, 'Specialty'),
            status: input.status,
            updatedAt: timestamp(),
          }
        : conversation,
    ),
  }))
}

export async function deleteConversation(id: string) {
  return updateDatabase((database) => ({
    ...database,
    conversations: database.conversations.filter(
      (conversation) => conversation.id !== id,
    ),
  }))
}

export async function createMessage(input: MessageInput) {
  const message: Message = {
    id: makeId('msg'),
    sender: input.sender,
    body: requireText(input.body, 'Message'),
    read: input.read ?? false,
    sentAt: timestamp(),
  }

  return updateDatabase((database) => ({
    ...database,
    conversations: database.conversations.map((conversation) =>
      conversation.id === input.conversationId
        ? {
            ...conversation,
            messages: [...conversation.messages, message],
            updatedAt: timestamp(),
          }
        : conversation,
    ),
  }))
}

export async function updateMessage(
  input: MessageInput & { messageId: string },
) {
  return updateDatabase((database) => ({
    ...database,
    conversations: database.conversations.map((conversation) =>
      conversation.id === input.conversationId
        ? {
            ...conversation,
            messages: conversation.messages.map((message) =>
              message.id === input.messageId
                ? {
                    ...message,
                    sender: input.sender,
                    body: requireText(input.body, 'Message'),
                    read: input.read ?? message.read,
                  }
                : message,
            ),
            updatedAt: timestamp(),
          }
        : conversation,
    ),
  }))
}

export async function deleteMessage(input: {
  conversationId: string
  messageId: string
}) {
  return updateDatabase((database) => ({
    ...database,
    conversations: database.conversations.map((conversation) =>
      conversation.id === input.conversationId
        ? {
            ...conversation,
            messages: conversation.messages.filter(
              (message) => message.id !== input.messageId,
            ),
            updatedAt: timestamp(),
          }
        : conversation,
    ),
  }))
}

export async function createHealthMetric(input: HealthMetricInput) {
  const data = validateMetric(input)
  const now = timestamp()
  const metric: HealthMetric = {
    ...data,
    id: makeId('metric'),
    createdAt: now,
    updatedAt: now,
  }

  return updateDatabase((database) => ({
    ...database,
    healthMetrics: [metric, ...database.healthMetrics],
  }))
}

export async function updateHealthMetric(
  input: HealthMetricInput & { id: string },
) {
  const data = validateMetric(input)
  return updateDatabase((database) => ({
    ...database,
    healthMetrics: database.healthMetrics.map((metric) =>
      metric.id === input.id
        ? { ...metric, ...data, updatedAt: timestamp() }
        : metric,
    ),
  }))
}

export async function deleteHealthMetric(id: string) {
  return updateDatabase((database) => ({
    ...database,
    healthMetrics: database.healthMetrics.filter((metric) => metric.id !== id),
  }))
}

export async function updateProfile(input: UserProfileInput) {
  return updateDatabase((database) => ({
    ...database,
    user: {
      ...database.user,
      name: requireText(input.name, 'Name'),
      age: requirePositiveNumber(Number(input.age), 'Age'),
      email: requireText(input.email, 'Email'),
      phone: requireText(input.phone, 'Phone'),
      carePlan: input.carePlan,
    } satisfies UserProfile,
  }))
}

export async function updateSubscription(plan: Subscription['plan']) {
  return updateDatabase((database) => ({
    ...database,
    user: { ...database.user, carePlan: plan },
    subscription: {
      plan,
      renewsAt: database.subscription.renewsAt,
      priorityConsultations: plan === 'Pro',
      personalizedGuidance: plan === 'Pro',
    },
  }))
}
