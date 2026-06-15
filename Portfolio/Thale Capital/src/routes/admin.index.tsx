import { createFileRoute } from '@tanstack/react-router'
import { useCms } from '../contexts/CmsContext'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { snapshot } = useCms()
  return (
    <div>
      <h1>CMS Dashboard</h1>
      <p>Mode: {snapshot.mode}</p>
      <div className="admin-grid">
        <article className="admin-card">
          <h3>Site Settings</h3>
          <p>{snapshot.siteSettings.length}</p>
        </article>
        <article className="admin-card">
          <h3>Pillars</h3>
          <p>{snapshot.pillars.length}</p>
        </article>
        <article className="admin-card">
          <h3>Investments</h3>
          <p>{snapshot.investments.length}</p>
        </article>
      </div>
    </div>
  )
}
