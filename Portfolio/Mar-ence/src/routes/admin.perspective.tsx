import { createFileRoute } from '@tanstack/react-router'
import { AdminSingletonSection } from '#/admin/pages/AdminSingletonSection'

export const Route = createFileRoute('/admin/perspective')({
  component: () => (
    <AdminSingletonSection
      title="Perspective"
      description="The Valence Perspective editorial section."
      table="perspective_section"
      emptyRow={() => ({
        id: crypto.randomUUID(),
        eyebrow: 'Perspective',
        title: 'The Valence Perspective',
        description: '',
        image_url: '',
        published: true,
      })}
      fields={[
        { key: 'eyebrow', label: 'Eyebrow' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'image_url', label: 'Image', type: 'image' },
      ]}
    />
  ),
})
