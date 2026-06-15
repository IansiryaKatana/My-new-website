import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getSupabase } from '../integrations/supabase/client'

type Submission = {
  id: string
  full_name: string
  email: string
  phone: string
  message: string
  created_at?: string
}

export const Route = createFileRoute('/admin/inbox')({
  component: AdminInbox,
})

function AdminInbox() {
  const [rows, setRows] = useState<Submission[]>([])
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const load = async () => {
      const sb = getSupabase()
      if (!sb) {
        setFeedback('Supabase not configured. Inbox requires live data.')
        return
      }
      const { data, error } = await sb
        .from('form_submissions')
        .select('id, full_name, email, phone, message, created_at')
        .order('created_at', { ascending: false })
        .limit(30)
      if (error) {
        setFeedback(error.message)
        return
      }
      setRows(data ?? [])
    }
    void load()
  }, [])

  return (
    <div>
      <h1>Lead Inbox</h1>
      {feedback && <p className="feedback">{feedback}</p>}
      <div className="admin-form-stack">
        {rows.map((row) => (
          <article key={row.id} className="admin-card">
            <strong>{row.full_name}</strong>
            <p>{row.email} · {row.phone}</p>
            <p>{row.message}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
