import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { adminBtnPrimary, adminInput, adminLabel } from './adminClassNames'

export function AdminLogin() {
  const { signIn, session, loading } = useAdminAuth()
  const navigate = useNavigate()
  const search = useSearch({ from: '/admin/login' }) as { from?: string }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && session) {
      void navigate({ to: search.from || '/admin' })
    }
  }, [loading, session, navigate, search.from])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = await signIn(email.trim(), password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    void navigate({ to: search.from || '/admin' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface-elevated)] p-6 shadow-[var(--admin-shadow)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--admin-primary)]">
          NGUNJUK CMS
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--admin-text)]">Admin sign in</h1>
        <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
          Use your Supabase admin credentials to manage site content.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label className={adminLabel} htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              className={adminInput}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label className={adminLabel} htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              className={adminInput}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-[var(--admin-danger)]">{error}</p> : null}

          <button type="submit" className={`${adminBtnPrimary} w-full`} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
