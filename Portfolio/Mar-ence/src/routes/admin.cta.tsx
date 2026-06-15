import { createFileRoute } from '@tanstack/react-router'
import { AdminSingletonSection } from '#/admin/pages/AdminSingletonSection'

export const Route = createFileRoute('/admin/cta')({
  component: () => (
    <AdminSingletonSection
      title="Final CTA"
      description="Dark hero CTA before footer."
      table="final_cta"
      emptyRow={() => ({
        id: crypto.randomUUID(),
        heading: '',
        button_label: 'Submit Opportunity',
        button_href: '#submit',
        background_image_url: '',
        published: true,
      })}
      fields={[
        { key: 'heading', label: 'Heading', type: 'textarea' },
        { key: 'button_label', label: 'Button label' },
        { key: 'button_href', label: 'Button href' },
        { key: 'background_image_url', label: 'Background', type: 'image' },
      ]}
    />
  ),
})
