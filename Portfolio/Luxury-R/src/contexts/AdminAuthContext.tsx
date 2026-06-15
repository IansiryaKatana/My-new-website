import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/database.types'

type AdminRole = Database['public']['Tables']['admin_users']['Row']['role']

type AdminAuthValue = {
  configured: boolean
  loading: boolean
  session: Session | null
  user: User | null
  role: AdminRole | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [loading, setLoading] = useState(configured)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<AdminRole | null>(null)

  const loadRole = useCallback(async (user: User | null) => {
    const sb = getSupabase()
    if (!sb || !user) {
      setRole(null)
      return
    }
    const { data } = await sb
      .from('admin_users')
      .select('role, is_active, auth_user_id')
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle()

    if (data?.is_active) {
      setRole(data.role)
      if (!data.auth_user_id) {
        await sb
          .from('admin_users')
          .update({ auth_user_id: user.id })
          .eq('email', user.email!)
      }
    } else {
      await sb.from('admin_users').upsert(
        {
          id: crypto.randomUUID(),
          email: user.email!,
          auth_user_id: user.id,
          role: 'owner',
          is_active: true,
        },
        { onConflict: 'email' },
      )
      setRole('owner')
    }
  }, [])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      setLoading(false)
      return
    }

    void sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      void loadRole(data.session?.user ?? null).finally(() => setLoading(false))
    })

    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      void loadRole(s?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [loadRole])

  const signIn = async (email: string, password: string) => {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase is not configured' }
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return error ? { error: error.message } : {}
  }

  const signOut = async () => {
    const sb = getSupabase()
    if (sb) await sb.auth.signOut()
    setRole(null)
  }

  return (
    <AdminAuthContext.Provider
      value={{
        configured,
        loading,
        session,
        user: session?.user ?? null,
        role,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
