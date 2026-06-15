import { createClient } from '@supabase/supabase-js'
import { createServerFn } from '@tanstack/react-start'
import { hubSignupSchema } from '@/lib/hub-signup-schema'

type SignupResult = {
  ok: boolean
  message: string
}

export const createHubSignup = createServerFn({ method: 'POST' })
  .inputValidator((input) => hubSignupSchema.parse(input))
  .handler(async ({ data }): Promise<SignupResult> => {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        ok: false,
        message:
          'Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable live signups.',
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    const { error } = await supabase.from('hub_signups').insert({
      full_name: data.name,
      email: data.email.toLowerCase(),
      interest: data.interest,
      consent: data.consent,
      source: 'landing_page',
    })

    if (error) {
      if (error.code === '23505') {
        return {
          ok: true,
          message:
            'You are already on the hub list. We will send the next learning note to this email.',
        }
      }

      return {
        ok: false,
        message: error.message,
      }
    }

    return {
      ok: true,
      message:
        'You are in. We will send a calm first lesson and topic guide to your inbox.',
    }
  })
