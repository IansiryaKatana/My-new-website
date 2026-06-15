import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="section section-off">
      <div className="section-inner">
        <h1>About</h1>
        <p>This route is intentionally minimal. Primary production experience is on the home page and CMS admin routes.</p>
      </div>
    </main>
  )
}
