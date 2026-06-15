import { Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

import { PasswordInput } from '../components/ui/password-input'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { adminBtnPrimary, adminInput, adminLabel } from './adminClassNames'
import './admin-theme.css'

export function AdminLogin() {
  const { configured, signIn } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    const result = await signIn(email.trim(), password)
    setBusy(false)
    if (result.error) {
      setErr(result.error)
      return
    }
    void navigate({ to: '/admin' })
  }

  if (!configured) {
    return (
      <div className="admin-root flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md border border-[var(--admin-cream)]/20 bg-[var(--admin-surface)] p-8">
          <h1 className="font-display text-3xl font-black uppercase">CMS unavailable</h1>
          <p className="mt-4 font-sans text-sm text-[var(--admin-cream)]/75">
            Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your{' '}
            <code>.env</code> file, then restart the dev server.
          </p>
          <Link to="/" className={`${adminBtnPrimary} mt-6 inline-flex`}>
            Back to site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-root flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-[var(--admin-cream)]/20 bg-[var(--admin-surface)] p-8"
      >
        <h1 className="font-display text-4xl font-black uppercase">Admin login</h1>
        <p className="mt-2 font-sans text-sm text-[var(--admin-cream)]/70">
          Sign in with your Supabase Auth account.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className={adminLabel}>Email</span>
            <input
              className={adminInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2">
            <span className={adminLabel}>Password</span>
            <PasswordInput
              inputClassName={adminInput}
              toggleClassName="text-[var(--admin-cream)]/55 hover:text-[var(--admin-cream)] focus-visible:text-[var(--admin-cream)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {err ? <p className="text-sm text-[#e88]">{err}</p> : null}
          <button type="submit" className={adminBtnPrimary} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
        <Link to="/" className="mt-6 inline-block font-display text-xs uppercase underline">
          Back to site
        </Link>
      </form>
    </div>
  )
}

