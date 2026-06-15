import { z } from 'zod'

export const addAccountSchema = z.object({
  accountType: z.enum(['wallet', 'exchange', 'manual_asset', 'bank']),
  provider: z.string().min(1, 'Provider is required'),
  label: z.string().min(1, 'Label is required'),
  publicAddress: z.string().optional(),
})

export type AddAccountFormValues = z.infer<typeof addAccountSchema>
