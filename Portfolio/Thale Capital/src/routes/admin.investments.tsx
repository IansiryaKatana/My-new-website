import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'

export const Route = createFileRoute('/admin/investments')({
  component: AdminInvestments,
})

function AdminInvestments() {
  const { snapshot, setSnapshot, refetch } = useCms()
  const [feedback, setFeedback] = useState('')

  const save = async () => {
    const sb = getSupabase()
    if (!sb) {
      setFeedback('Saved locally in static mode.')
      return
    }
    const { error } = await sb
      .from('investments')
      .upsert(snapshot.investments, { onConflict: 'id' })
    if (error) {
      setFeedback(error.message)
      return
    }
    await refetch()
    setFeedback('Investments saved.')
  }

  return (
    <div>
      <h1>Investments</h1>
      <div className="admin-form-stack">
        {snapshot.investments.map((item) => (
          <article className="admin-card" key={item.id}>
            <input
              value={item.title}
              onChange={(e) =>
                setSnapshot((prev) => ({
                  ...prev,
                  investments: prev.investments.map((x) =>
                    x.id === item.id ? { ...x, title: e.target.value } : x,
                  ),
                }))
              }
            />
            <textarea
              value={item.description}
              onChange={(e) =>
                setSnapshot((prev) => ({
                  ...prev,
                  investments: prev.investments.map((x) =>
                    x.id === item.id ? { ...x, description: e.target.value } : x,
                  ),
                }))
              }
            />
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={item.is_featured}
                onChange={(e) =>
                  setSnapshot((prev) => ({
                    ...prev,
                    investments: prev.investments.map((x) =>
                      x.id === item.id ? { ...x, is_featured: e.target.checked } : x,
                    ),
                  }))
                }
              />
              Featured investment
            </label>
          </article>
        ))}
      </div>
      <button className="btn" onClick={() => void save()}>
        Save investments
      </button>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  )
}
