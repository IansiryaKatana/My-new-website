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
import type { Database } from '#/integrations/supabase/database.types'

type AdminUserRow = Database['public']['Tables']['admin_users']['Row']

type AdminAuthContextValue = {
  configured: boolean
  loading: boolean
  session: Session | null
  user: User | null
  adminUser: AdminUserRow | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  ensureAdminRecord: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [loading, setLoading] = useState(configured)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUserRow | null>(null)

  const loadAdminUser = useCallback(async (u: User | null) => {
    const sb = getSupabase()
    if (!sb || !u?.email) {
      setAdminUser(null)
      return
    }
    const { data } = await sb
      .from('admin_users')
      .select('*')
      .or(`auth_user_id.eq.${u.id},email.eq.${u.email}`)
      .maybeSingle()
    setAdminUser(data ?? null)
  }, [])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      setLoading(false)
      return
    }

    void sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      void loadAdminUser(data.session?.user ?? null).finally(() =>
        setLoading(false),
      )
    })

    const { data: sub } = sb.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      void loadAdminUser(nextSession?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [loadAdminUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase is not configured' }
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }, [])

  const signOut = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    await sb.auth.signOut()
    setAdminUser(null)
  }, [])

  const ensureAdminRecord = useCallback(async () => {
    const sb = getSupabase()
    if (!sb || !user?.email) return
    if (adminUser) return

    const { data: existing } = await sb
      .from('admin_users')
      .select('id')
      .eq('email', user.email)
      .maybeSingle()

    if (existing) return

    await sb.from('admin_users').insert({
      id: crypto.randomUUID(),
      auth_user_id: user.id,
      email: user.email,
      role: 'owner',
      is_active: true,
    })
    await loadAdminUser(user)
  }, [adminUser, loadAdminUser, user])

  const value = useMemo(
    () => ({
      configured,
      loading,
      session,
      user,
      adminUser,
      signIn,
      signOut,
      ensureAdminRecord,
    }),
    [
      configured,
      loading,
      session,
      user,
      adminUser,
      signIn,
      signOut,
      ensureAdminRecord,
    ],
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
