import { createFileRoute } from '@tanstack/react-router'
import { AdminSingletonSection } from '#/admin/pages/AdminSingletonSection'

export const Route = createFileRoute('/admin/footer')({
  component: () => (
    <AdminSingletonSection
      title="Footer"
      description="Footer statement and wordmark."
      table="footer_content"
      emptyRow={() => ({
        id: crypto.randomUUID(),
        statement: '',
        wordmark: 'VALENCE',
        published: true,
      })}
      fields={[
        { key: 'statement', label: 'Statement', type: 'textarea' },
        { key: 'wordmark', label: 'Wordmark' },
      ]}
    />
  ),
})
