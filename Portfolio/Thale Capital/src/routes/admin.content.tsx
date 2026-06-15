import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'

export const Route = createFileRoute('/admin/content')({
  component: AdminContent,
})

function AdminContent() {
  const { snapshot, setSnapshot, refetch } = useCms()
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState('')

  const updateSetting = (key: string, value: string) => {
    setSnapshot((prev) => ({
      ...prev,
      siteSettings: prev.siteSettings.map((item) =>
        item.key === key ? { ...item, value } : item,
      ),
    }))
  }

  const save = async () => {
    setBusy(true)
    const sb = getSupabase()
    if (!sb) {
      setBusy(false)
      setFeedback('Saved locally in static mode.')
      return
    }
    const { error } = await sb
      .from('site_settings')
      .upsert(snapshot.siteSettings, { onConflict: 'key' })
    setBusy(false)
    if (error) {
      setFeedback(error.message)
      return
    }
    await refetch()
    setFeedback('Saved successfully.')
  }

  return (
    <div>
      <h1>Site Settings</h1>
      <div className="admin-form-stack">
        {snapshot.siteSettings.map((item) => (
          <label key={item.key}>
            <span>{item.key}</span>
            <textarea
              value={item.value}
              onChange={(e) => updateSetting(item.key, e.target.value)}
            />
          </label>
        ))}
      </div>
      <button className="btn" disabled={busy} onClick={() => void save()}>
        {busy ? 'Saving...' : 'Save settings'}
      </button>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  )
}
