import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAdminAuth } from '#/contexts/AdminAuthContext'
import { isSupabaseConfigured } from '#/integrations/supabase/client'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const { signIn, session, configured, ensureAdminRecord, loading } =
    useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && session) {
      void ensureAdminRecord()
      void navigate({ to: '/admin' })
    }
  }, [session, loading, navigate, ensureAdminRecord])

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 admin-root">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Supabase not configured</h1>
          <p className="text-sm text-gray-600">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.
          </p>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const result = await signIn(email, password)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    await ensureAdminRecord()
    void navigate({ to: '/admin' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--admin-surface)] admin-root">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border rounded-xl p-8 space-y-4 shadow-sm"
      >
        <h1 className="text-xl font-semibold">Valence CMS</h1>
        <p className="text-sm text-gray-500">Sign in to manage content.</p>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
