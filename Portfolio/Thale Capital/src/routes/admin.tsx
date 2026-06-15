import { Link, Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => ({ title: 'Admin CMS' }),
  component: AdminLayout,
})

function AdminLayout() {
  const auth = useAdminAuth()

  if (!auth.isReady) return <main className="section section-off"><div className="section-inner">Loading admin...</div></main>
  if (!auth.isAuthenticated) return <Navigate to="/admin/login" />

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <h2>CMS</h2>
        <nav>
          <Link to="/admin" activeProps={{ className: 'active' }}>Dashboard</Link>
          <Link to="/admin/content" activeProps={{ className: 'active' }}>Site Settings</Link>
          <Link to="/admin/pillars" activeProps={{ className: 'active' }}>Pillars</Link>
          <Link to="/admin/investments" activeProps={{ className: 'active' }}>Investments</Link>
          <Link to="/admin/inbox" activeProps={{ className: 'active' }}>Inbox</Link>
        </nav>
        <button className="btn" onClick={() => void auth.signOut()}>Sign out</button>
      </aside>
      <section className="admin-content"><Outlet /></section>
    </main>
  )
}
