import { createClient } from '@supabase/supabase-js'

function getSupabaseConfig() {
  // In Vite/TanStack Start, import.meta.env is the source of truth from .env files.
  // process.env can contain stale shell values and must not take precedence.
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and restart the dev server.',
    )
  }

  return { url, key }
}

export function createBrowserSupabaseClient() {
  const { url, key } = getSupabaseConfig()
  return createClient(url, key)
}

export function createServerSupabaseClient() {
  const { url, key } = getSupabaseConfig()
  return createClient(url, key)
}
