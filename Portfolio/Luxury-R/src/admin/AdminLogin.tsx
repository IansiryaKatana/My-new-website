import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { adminBtn, adminInput } from './adminClassNames'
import '@/admin/admin-theme.css'

export function AdminLogin() {
  const { signIn, configured, loading, session } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && session) {
      void navigate({ to: '/admin' })
    }
  }, [loading, session, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2eee7] text-[#8b897f]">
        Loading…
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const result = await signIn(email, password)
    setBusy(false)
    if (result.error) setError(result.error)
    else void navigate({ to: '/admin' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2eee7] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md border border-[#d8d2c7] bg-white p-8"
      >
        <h1 className="font-display text-2xl uppercase tracking-tight">
          Admin login
        </h1>
        {!configured && (
          <p className="mt-2 text-sm text-amber-800">
            Supabase env vars missing — login will not work until configured.
          </p>
        )}
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[#8b897f]">
              Email
            </label>
            <input
              type="email"
              className={`${adminInput} mt-1`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[#8b897f]">
              Password
            </label>
            <input
              type="password"
              className={`${adminInput} mt-1`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button type="submit" className={`${adminBtn} mt-6 w-full`} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/" className="mt-4 block text-center text-xs text-[#8b897f]">
          ← Back to site
        </Link>
      </form>
    </div>
  )
}
