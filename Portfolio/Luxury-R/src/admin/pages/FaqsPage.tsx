import { useCallback, useEffect, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { Database } from '@/integrations/supabase/database.types'
import { getSupabase } from '@/integrations/supabase/client'
import { adminBtn, adminBtnGhost, adminInput } from '../adminClassNames'
import { AdminModal } from '../components/AdminModal'
import { AdminPageHeading } from '../components/AdminPageHeading'

type Row = Database['public']['Tables']['faq_entries']['Row']

export function AdminFaqs() {
  const { refetch } = useCms()
  const [rows, setRows] = useState<Row[]>([])
  const [draft, setDraft] = useState<Partial<Row> | null>(null)
  const [open, setOpen] = useState(false)
  const [topicId, setTopicId] = useState<string>('')

  const refresh = useCallback(async () => {
    const sb = getSupabase()
    if (!sb) return
    let tid = topicId
    if (!tid) {
      const { data: topics } = await sb.from('faq_topics').select('id').limit(1)
      tid = topics?.[0]?.id ?? ''
      if (!tid) {
        const id = crypto.randomUUID()
        await sb.from('faq_topics').insert({ id, title: 'General', sort_order: 0, published: true })
        tid = id
      }
      setTopicId(tid)
    }
    const { data } = await sb.from('faq_entries').select('*').order('sort_order')
    setRows(data ?? [])
  }, [topicId])

  useEffect(() => { void refresh() }, [refresh])

  const save = async () => {
    const sb = getSupabase()
    if (!sb || !draft?.question || !topicId) return
    await sb.from('faq_entries').upsert({
      id: draft.id ?? crypto.randomUUID(),
      topic_id: topicId,
      question: draft.question,
      answer: draft.answer ?? '',
      sort_order: draft.sort_order ?? 0,
      published: draft.published ?? true,
    })
    setOpen(false)
    await refresh()
    await refetch()
  }

  return (
    <div>
      <AdminPageHeading title="FAQs" description="Questions shown in the accordion" />
      <button type="button" className={`${adminBtn} mb-4`} onClick={() => { setDraft({ id: crypto.randomUUID(), published: true, sort_order: 0 }); setOpen(true) }}>Add FAQ</button>
      {rows.map((r) => (
        <div key={r.id} className="mb-2 flex justify-between border border-[#d8d2c7] bg-white p-4">
          <span className="text-sm">{r.question}</span>
          <button type="button" className={adminBtnGhost} onClick={() => { setDraft(r); setOpen(true) }}>Edit</button>
        </div>
      ))}
      <AdminModal open={open} onOpenChange={setOpen} title="FAQ entry" onSave={save}>
        {draft && (
          <div className="space-y-3">
            <input className={adminInput} placeholder="Question" value={draft.question ?? ''} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
            <textarea className={`${adminInput} min-h-[100px]`} placeholder="Answer" value={draft.answer ?? ''} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
          </div>
        )}
      </AdminModal>
    </div>
  )
}
