import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSupabase } from '../integrations/supabase/client'

type AdminAuthContextValue = {
  userEmail: string | null
  isReady: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) {
      setIsReady(true)
      return
    }

    sb.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null)
      setIsReady(true)
    })

    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      userEmail,
      isReady,
      isAuthenticated: Boolean(userEmail),
      async signIn(email, password) {
        const sb = getSupabase()
        if (!sb) {
          return { error: 'Supabase is not configured in .env yet.' }
        }
        const { error } = await sb.auth.signInWithPassword({ email, password })
        if (error) return { error: error.message }
        return {}
      },
      async signOut() {
        const sb = getSupabase()
        if (!sb) return
        await sb.auth.signOut()
      },
    }),
    [isReady, userEmail],
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used in AdminAuthProvider')
  return ctx
}
