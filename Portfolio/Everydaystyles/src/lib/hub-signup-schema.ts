import { z } from 'zod'

export const hubSignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your name so we can personalize the hub invite.')
    .max(120, 'Name must be 120 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .max(180, 'Email must be 180 characters or fewer.'),
  interest: z.enum(
    ['consent-guide', 'communication', 'confidence', 'weekly-lessons'],
    { error: 'Choose the topic you want to start with.' },
  ),
  consent: z.boolean().refine(Boolean, {
    message: 'Confirm you want to receive learning updates.',
  }),
})

export type HubSignupInput = z.infer<typeof hubSignupSchema>
