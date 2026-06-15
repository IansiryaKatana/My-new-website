import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { isSupabaseConfigured } from '#/integrations/supabase/client'

export function AdminLogin() {
  const { signIn, session, configured } = useAdminAuth()
  const navigate = useNavigate()
  const search = useSearch({ from: '/admin/login' }) as { from?: string }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (session) {
    void navigate({ to: (search.from as '/admin') || '/admin' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await signIn(email.trim(), password)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    void navigate({ to: (search.from as '/admin') || '/admin' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--admin-surface)] p-6">
      <div className="w-full max-w-sm rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-[var(--admin-text)]">Marden CMS</h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">Sign in to manage content</p>

        {!configured && (
          <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            Supabase env vars missing. Copy <code>.env.example</code> to <code>.env</code>.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button variant="admin" type="submit" className="w-full" disabled={busy || !configured}>
            {busy ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <Link to="/" className="mt-4 block text-center text-xs text-[var(--admin-muted)] hover:underline">
          Back to website
        </Link>
      </div>
    </div>
  )
}
