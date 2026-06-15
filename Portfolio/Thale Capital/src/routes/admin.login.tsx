import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginRoute,
})

function AdminLoginRoute() {
  const auth = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = await auth.signIn(email, password)
    if (result.error) {
      setError(result.error)
      return
    }
    await navigate({ to: '/admin' })
  }

  return (
    <main className="section section-off">
      <div className="section-inner admin-login">
        <h1>Admin Login</h1>
        <form onSubmit={submit} className="contact-form">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit">
            Sign in
          </button>
          {error && <p className="feedback">{error}</p>}
          <Link to="/">Back to site</Link>
        </form>
      </div>
    </main>
  )
}
