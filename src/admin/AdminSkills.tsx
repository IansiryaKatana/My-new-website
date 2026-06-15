import { useEffect, useState } from 'react'

import { useCms } from '../contexts/CmsContext'
import { getSupabase } from '../integrations/supabase/client'
import type { Tables } from '../integrations/supabase/database.types'
import {
  adminBtn,
  adminBtnDanger,
  adminBtnPrimary,
  adminInput,
  adminLabel,
  adminTable,
  adminTd,
  adminTh,
} from './adminClassNames'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'

type GroupRow = Tables<'skill_groups'>
type ItemRow = Tables<'skill_items'>

export function AdminSkills() {
  const { refetch } = useCms()
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [items, setItems] = useState<ItemRow[]>([])
  const [groupModal, setGroupModal] = useState(false)
  const [itemModal, setItemModal] = useState(false)
  const [groupDraft, setGroupDraft] = useState<GroupRow | null>(null)
  const [itemDraft, setItemDraft] = useState<ItemRow | null>(null)
  const [filterGroupId, setFilterGroupId] = useState<string>('')

  async function refresh() {
    const sb = getSupabase()
    if (!sb) return
    const [g, i] = await Promise.all([
      sb.from('skill_groups').select('*').order('sort_order'),
      sb.from('skill_items').select('*').order('sort_order'),
    ])
    setGroups(g.data ?? [])
    setItems(i.data ?? [])
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function saveGroup() {
    if (!groupDraft?.title.trim()) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('skill_groups').upsert(groupDraft, { onConflict: 'id' })
    setGroupModal(false)
    await refresh()
    await refetch()
  }

  async function saveItem() {
    if (!itemDraft?.label.trim() || !itemDraft.group_id) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('skill_items').upsert(itemDraft, { onConflict: 'id' })
    setItemModal(false)
    await refresh()
    await refetch()
  }

  const filteredItems = filterGroupId
    ? items.filter((i) => i.group_id === filterGroupId)
    : items

  return (
    <div>
      <AdminPageHeading title="Skills" description="Skill groups and items for the stack section." />
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex justify-between gap-2">
            <h2 className="font-display text-lg font-black uppercase">Groups</h2>
            <button
              type="button"
              className={adminBtnPrimary}
              onClick={() => {
                setGroupDraft({
                  id: crypto.randomUUID(),
                  title: '',
                  sort_order: groups.length,
                  published: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                setGroupModal(true)
              }}
            >
              Add group
            </button>
          </div>
          <table className={adminTable}>
            <thead><tr><th className={adminTh}>Title</th><th className={adminTh}>Actions</th></tr></thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id}>
                  <td className={adminTd}>{g.title}</td>
                  <td className={adminTd}>
                    <button type="button" className={adminBtn} onClick={() => { setGroupDraft({ ...g }); setGroupModal(true) }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-black uppercase">Items</h2>
            <div className="flex gap-2">
              <select className={adminInput} value={filterGroupId} onChange={(e) => setFilterGroupId(e.target.value)}>
                <option value="">All groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
              <button
                type="button"
                className={adminBtnPrimary}
                disabled={groups.length === 0}
                onClick={() => {
                  setItemDraft({
                    id: crypto.randomUUID(),
                    group_id: filterGroupId || groups[0]?.id || '',
                    label: '',
                    sort_order: 0,
                    created_at: new Date().toISOString(),
                  })
                  setItemModal(true)
                }}
              >
                Add item
              </button>
            </div>
          </div>
          <table className={adminTable}>
            <thead><tr><th className={adminTh}>Label</th><th className={adminTh}>Group</th><th className={adminTh}>Actions</th></tr></thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className={adminTd}>{item.label}</td>
                  <td className={adminTd}>{groups.find((g) => g.id === item.group_id)?.title}</td>
                  <td className={adminTd}>
                    <button type="button" className={adminBtnDanger} onClick={async () => {
                      const sb = getSupabase()
                      if (!sb) return
                      await sb.from('skill_items').delete().eq('id', item.id)
                      await refresh()
                      await refetch()
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <AdminModal open={groupModal} onOpenChange={setGroupModal} title="Skill group" footer={<><button type="button" className={adminBtn} onClick={() => setGroupModal(false)}>Cancel</button><button type="button" className={adminBtnPrimary} onClick={() => void saveGroup()}>Save</button></>}>
        {groupDraft ? (
          <>
            <label className="grid gap-2"><span className={adminLabel}>Title</span><input className={adminInput} value={groupDraft.title} onChange={(e) => setGroupDraft({ ...groupDraft, title: e.target.value })} /></label>
            <label className="flex items-center gap-2 font-sans text-sm"><input type="checkbox" checked={groupDraft.published} onChange={(e) => setGroupDraft({ ...groupDraft, published: e.target.checked })} /> Published</label>
          </>
        ) : null}
      </AdminModal>

      <AdminModal open={itemModal} onOpenChange={setItemModal} title="Skill item" footer={<><button type="button" className={adminBtn} onClick={() => setItemModal(false)}>Cancel</button><button type="button" className={adminBtnPrimary} onClick={() => void saveItem()}>Save</button></>}>
        {itemDraft ? (
          <>
            <label className="grid gap-2"><span className={adminLabel}>Group</span>
              <select className={adminInput} value={itemDraft.group_id} onChange={(e) => setItemDraft({ ...itemDraft, group_id: e.target.value })}>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </label>
            <label className="grid gap-2"><span className={adminLabel}>Label</span><input className={adminInput} value={itemDraft.label} onChange={(e) => setItemDraft({ ...itemDraft, label: e.target.value })} /></label>
          </>
        ) : null}
      </AdminModal>
    </div>
  )
}

