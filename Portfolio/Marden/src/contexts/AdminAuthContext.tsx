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
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

async function fetchAdminUser(user: User): Promise<AdminUserRow | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb
    .from('admin_users')
    .select('*')
    .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
    .eq('is_active', true)
    .maybeSingle()
  return data
}

async function ensureOwnerRecord(user: User) {
  const sb = getSupabase()
  if (!sb || !user.email) return
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
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [loading, setLoading] = useState(configured)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUserRow | null>(null)

  const refreshAdminUser = useCallback(async (u: User | null) => {
    if (!u) {
      setAdminUser(null)
      return
    }
    await ensureOwnerRecord(u)
    const row = await fetchAdminUser(u)
    setAdminUser(row)
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
      void refreshAdminUser(data.session?.user ?? null).finally(() => setLoading(false))
    })

    const { data: sub } = sb.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      void refreshAdminUser(nextSession?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [refreshAdminUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase is not configured.' }
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    await sb.auth.signOut()
    setAdminUser(null)
  }, [])

  const value = useMemo(
    () => ({
      configured,
      loading,
      session,
      user,
      adminUser,
      signIn,
      signOut,
    }),
    [configured, loading, session, user, adminUser, signIn, signOut],
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
