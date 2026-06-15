import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '#/integrations/supabase/client'
import type { TablesInsert } from '#/integrations/supabase/database.types'

interface AdminAuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  ensureCurrentUserRecord: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    let active = true

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: 'Supabase is not configured.' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const ensureCurrentUserRecord = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase || !user?.email) return

    const { data: existing, error: lookupError } = await supabase
      .from('admin_users')
      .select('id')
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle()

    if (lookupError || existing) return

    const { count, error: countError } = await supabase
      .from('admin_users')
      .select('id', { count: 'exact', head: true })

    if (countError) return

    const role = (count ?? 0) === 0 ? 'owner' : 'editor'
    const displayName = user.email.split('@')[0] ?? 'Admin'

    const row: TablesInsert<'admin_users'> = {
      auth_user_id: user.id,
      email: user.email,
      role,
      display_name: displayName,
      is_active: true,
    }

    await supabase.from('admin_users').insert(row)
  }, [user])

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      signIn,
      signOut,
      ensureCurrentUserRecord,
    }),
    [session, user, loading, signIn, signOut, ensureCurrentUserRecord],
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
