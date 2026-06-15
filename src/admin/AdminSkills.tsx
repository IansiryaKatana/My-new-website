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
import { AdminConfirmDialog } from './components/AdminConfirmDialog'
import { AdminModal } from './components/AdminModal'
import { AdminPageHeading } from './components/AdminPageHeading'
import { AdminSelectField, AdminToolbarSelect } from './components/AdminSelect'
import { AdminTablePagination } from './components/AdminTablePagination'
import { AdminTabs } from './components/AdminTabs'
import { useAdminTablePagination } from './useAdminTablePagination'

type GroupRow = Tables<'skill_groups'>
type ItemRow = Tables<'skill_items'>
type SkillsTab = 'groups' | 'items'

export function AdminSkills() {
  const { refetch } = useCms()
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [items, setItems] = useState<ItemRow[]>([])
  const [activeTab, setActiveTab] = useState<SkillsTab>('groups')
  const [groupModal, setGroupModal] = useState(false)
  const [itemModal, setItemModal] = useState(false)
  const [groupDraft, setGroupDraft] = useState<GroupRow | null>(null)
  const [itemDraft, setItemDraft] = useState<ItemRow | null>(null)
  const [filterGroupId, setFilterGroupId] = useState<string>('')
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

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

  async function confirmDeleteItem() {
    if (!deleteItemId) return
    const sb = getSupabase()
    if (!sb) return
    await sb.from('skill_items').delete().eq('id', deleteItemId)
    setDeleteItemId(null)
    await refresh()
    await refetch()
  }

  const filteredItems = filterGroupId
    ? items.filter((i) => i.group_id === filterGroupId)
    : items

  const groupPagination = useAdminTablePagination(groups)
  const itemPagination = useAdminTablePagination(filteredItems)

  return (
    <div>
      <AdminPageHeading title="Skills" description="Skill groups and items for the stack section." />

      <AdminTabs
        active={activeTab}
        onChange={(id) => setActiveTab(id as SkillsTab)}
        tabs={[
          { id: 'groups', label: 'Groups' },
          { id: 'items', label: 'Items' },
        ]}
        actions={
          activeTab === 'groups' ? (
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
          ) : (
            <>
              <AdminToolbarSelect
                label="Filter"
                value={filterGroupId}
                onChange={(e) => setFilterGroupId(e.target.value)}
              >
                <option value="">All groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </AdminToolbarSelect>
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
            </>
          )
        }
      />

      {activeTab === 'groups' ? (
        <section>
          <div className="overflow-x-auto">
            <table className={adminTable}>
              <thead>
                <tr>
                  <th className={adminTh}>Title</th>
                  <th className={adminTh}>Published</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupPagination.slice.map((g) => (
                  <tr key={g.id}>
                    <td className={adminTd}>{g.title}</td>
                    <td className={adminTd}>{g.published ? 'Yes' : 'No'}</td>
                    <td className={adminTd}>
                      <button
                        type="button"
                        className={adminBtn}
                        onClick={() => {
                          setGroupDraft({ ...g })
                          setGroupModal(true)
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            page={groupPagination.page}
            pageCount={groupPagination.pageCount}
            total={groupPagination.total}
            onPrev={groupPagination.prev}
            onNext={groupPagination.next}
          />
        </section>
      ) : (
        <section>
          <div className="overflow-x-auto">
            <table className={adminTable}>
              <thead>
                <tr>
                  <th className={adminTh}>Label</th>
                  <th className={adminTh}>Group</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemPagination.slice.map((item) => (
                  <tr key={item.id}>
                    <td className={adminTd}>{item.label}</td>
                    <td className={adminTd}>{groups.find((g) => g.id === item.group_id)?.title}</td>
                    <td className={adminTd}>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={adminBtn}
                          onClick={() => {
                            setItemDraft({ ...item })
                            setItemModal(true)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={adminBtnDanger}
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminTablePagination
            page={itemPagination.page}
            pageCount={itemPagination.pageCount}
            total={itemPagination.total}
            onPrev={itemPagination.prev}
            onNext={itemPagination.next}
          />
        </section>
      )}

      <AdminModal
        open={groupModal}
        onOpenChange={setGroupModal}
        title="Skill group"
        footer={
          <>
            <button type="button" className={adminBtn} onClick={() => setGroupModal(false)}>
              Cancel
            </button>
            <button type="button" className={adminBtnPrimary} onClick={() => void saveGroup()}>
              Save
            </button>
          </>
        }
      >
        {groupDraft ? (
          <>
            <label className="grid gap-2">
              <span className={adminLabel}>Title</span>
              <input
                className={adminInput}
                value={groupDraft.title}
                onChange={(e) => setGroupDraft({ ...groupDraft, title: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 font-sans text-sm">
              <input
                type="checkbox"
                checked={groupDraft.published}
                onChange={(e) => setGroupDraft({ ...groupDraft, published: e.target.checked })}
              />
              Published
            </label>
          </>
        ) : null}
      </AdminModal>

      <AdminModal
        open={itemModal}
        onOpenChange={setItemModal}
        title="Skill item"
        footer={
          <>
            <button type="button" className={adminBtn} onClick={() => setItemModal(false)}>
              Cancel
            </button>
            <button type="button" className={adminBtnPrimary} onClick={() => void saveItem()}>
              Save
            </button>
          </>
        }
      >
        {itemDraft ? (
          <>
            <AdminSelectField
              label="Group"
              value={itemDraft.group_id}
              onChange={(e) => setItemDraft({ ...itemDraft, group_id: e.target.value })}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </AdminSelectField>
            <label className="grid gap-2">
              <span className={adminLabel}>Label</span>
              <input
                className={adminInput}
                value={itemDraft.label}
                onChange={(e) => setItemDraft({ ...itemDraft, label: e.target.value })}
              />
            </label>
          </>
        ) : null}
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteItemId)}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
        title="Delete skill item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDeleteItem}
      />
    </div>
  )
}
