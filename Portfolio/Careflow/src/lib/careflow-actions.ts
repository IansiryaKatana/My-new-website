import { createServerFn } from '@tanstack/react-start'
import type {
  AppointmentInput,
  ConversationInput,
  HealthMetricInput,
  MessageInput,
  Subscription,
  UserProfileInput,
} from './careflow-types'

export const getCareFlowData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const database = await import('../server/database')
    return database.readDatabase()
  },
)

export const createAppointmentAction = createServerFn({ method: 'POST' })
  .inputValidator((input: AppointmentInput) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.createAppointment(data)
  })

export const updateAppointmentAction = createServerFn({ method: 'POST' })
  .inputValidator((input: AppointmentInput & { id: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateAppointment(data)
  })

export const deleteAppointmentAction = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.deleteAppointment(data.id)
  })

export const updateConsultationAction = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: {
      id: string
      status?: 'Live' | 'Scheduled' | 'Ended'
      patientVideoEnabled?: boolean
      patientMicEnabled?: boolean
    }) => input,
  )
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateConsultation(data)
  })

export const createConversationAction = createServerFn({ method: 'POST' })
  .inputValidator((input: ConversationInput) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.createConversation(data)
  })

export const updateConversationAction = createServerFn({ method: 'POST' })
  .inputValidator((input: ConversationInput & { id: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateConversation(data)
  })

export const deleteConversationAction = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.deleteConversation(data.id)
  })

export const createMessageAction = createServerFn({ method: 'POST' })
  .inputValidator((input: MessageInput) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.createMessage(data)
  })

export const updateMessageAction = createServerFn({ method: 'POST' })
  .inputValidator((input: MessageInput & { messageId: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateMessage(data)
  })

export const deleteMessageAction = createServerFn({ method: 'POST' })
  .inputValidator((input: { conversationId: string; messageId: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.deleteMessage(data)
  })

export const createHealthMetricAction = createServerFn({ method: 'POST' })
  .inputValidator((input: HealthMetricInput) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.createHealthMetric(data)
  })

export const updateHealthMetricAction = createServerFn({ method: 'POST' })
  .inputValidator((input: HealthMetricInput & { id: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateHealthMetric(data)
  })

export const deleteHealthMetricAction = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.deleteHealthMetric(data.id)
  })

export const updateProfileAction = createServerFn({ method: 'POST' })
  .inputValidator((input: UserProfileInput) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateProfile(data)
  })

export const updateSubscriptionAction = createServerFn({ method: 'POST' })
  .inputValidator((input: { plan: Subscription['plan'] }) => input)
  .handler(async ({ data }) => {
    const database = await import('../server/database')
    return database.updateSubscription(data.plan)
  })
