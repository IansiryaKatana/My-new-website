import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'

export const Route = createFileRoute('/admin/pillars')({
  component: AdminPillars,
})

function AdminPillars() {
  const { snapshot, setSnapshot, refetch } = useCms()
  const [feedback, setFeedback] = useState('')

  const addRow = () => {
    setSnapshot((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          id: crypto.randomUUID(),
          title: 'New pillar',
          description: '',
          sort_order: prev.pillars.length + 1,
          is_highlighted: false,
        },
      ],
    }))
  }

  const save = async () => {
    const sb = getSupabase()
    if (!sb) {
      setFeedback('Saved locally in static mode.')
      return
    }
    const { error } = await sb
      .from('pillars')
      .upsert(snapshot.pillars, { onConflict: 'id' })
    if (error) {
      setFeedback(error.message)
      return
    }
    await refetch()
    setFeedback('Pillars saved.')
  }

  return (
    <div>
      <h1>Pillars</h1>
      <div className="admin-form-stack">
        {snapshot.pillars.map((pillar, index) => (
          <article className="admin-card" key={pillar.id}>
            <input
              value={pillar.title}
              onChange={(e) =>
                setSnapshot((prev) => ({
                  ...prev,
                  pillars: prev.pillars.map((item) =>
                    item.id === pillar.id ? { ...item, title: e.target.value } : item,
                  ),
                }))
              }
            />
            <textarea
              value={pillar.description}
              onChange={(e) =>
                setSnapshot((prev) => ({
                  ...prev,
                  pillars: prev.pillars.map((item) =>
                    item.id === pillar.id
                      ? { ...item, description: e.target.value }
                      : item,
                  ),
                }))
              }
            />
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={pillar.is_highlighted}
                onChange={(e) =>
                  setSnapshot((prev) => ({
                    ...prev,
                    pillars: prev.pillars.map((item) =>
                      item.id === pillar.id
                        ? { ...item, is_highlighted: e.target.checked }
                        : item,
                    ),
                  }))
                }
              />
              Highlight row
            </label>
            <small>Order #{index + 1}</small>
          </article>
        ))}
      </div>
      <div className="admin-row">
        <button className="btn btn-light" onClick={addRow}>
          Add pillar
        </button>
        <button className="btn" onClick={() => void save()}>
          Save pillars
        </button>
      </div>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  )
}
