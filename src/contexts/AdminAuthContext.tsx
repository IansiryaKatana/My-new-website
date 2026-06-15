import type { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getSupabase, isSupabaseConfigured } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'

export type AdminRole = Tables<'admin_users'>['role']

type AdminAuthContextValue = {
  configured: boolean
  loading: boolean
  session: Session | null
  user: User | null
  adminUser: Tables<'admin_users'> | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshAdminUser: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured()
  const [loading, setLoading] = useState(configured)
  const [session, setSession] = useState<Session | null>(null)
  const [adminUser, setAdminUser] = useState<Tables<'admin_users'> | null>(null)

  const loadAdminUser = useCallback(async (user: User | null) => {
    const sb = getSupabase()
    if (!sb || !user) {
      setAdminUser(null)
      return
    }

    const { data } = await sb
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (data) {
      setAdminUser(data)
      return
    }

    const { data: byEmail } = await sb
      .from('admin_users')
      .select('*')
      .eq('email', user.email ?? '')
      .eq('is_active', true)
      .maybeSingle()

    if (byEmail && !byEmail.auth_user_id) {
      await sb
        .from('admin_users')
        .update({ auth_user_id: user.id })
        .eq('id', byEmail.id)
      setAdminUser({ ...byEmail, auth_user_id: user.id })
      return
    }

    if (!byEmail) {
      const { count } = await sb
        .from('admin_users')
        .select('*', { count: 'exact', head: true })

      if (count === 0 && user.email) {
        const { data: created } = await sb
          .from('admin_users')
          .insert({
            email: user.email,
            auth_user_id: user.id,
            role: 'owner',
            is_active: true,
          })
          .select('*')
          .single()
        setAdminUser(created)
        return
      }
    }

    setAdminUser(byEmail ?? null)
  }, [])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      setLoading(false)
      return
    }

    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      void loadAdminUser(data.session?.user ?? null).finally(() => setLoading(false))
    })

    const { data: sub } = sb.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      void loadAdminUser(nextSession?.user ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [loadAdminUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = getSupabase()
    if (!sb) return { error: 'Supabase is not configured.' }

    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return {}
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
      user: session?.user ?? null,
      adminUser,
      signIn,
      signOut,
      refreshAdminUser: async () => loadAdminUser(session?.user ?? null),
    }),
    [configured, loading, session, adminUser, signIn, signOut, loadAdminUser],
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return ctx
}

export function canEditCms(role: AdminRole | undefined) {
  return role === 'owner' || role === 'admin' || role === 'editor'
}

export function canManageUsers(role: AdminRole | undefined) {
  return role === 'owner' || role === 'admin'
}

