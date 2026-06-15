import { useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { PropertyCategory } from '@/lib/cms/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PropertyFilter({
  active,
  onChange,
}: {
  active: PropertyCategory
  onChange: (c: PropertyCategory) => void
}) {
  const { data } = useCms()
  const helper = data.marketingBlocks.filter_helper

  return (
    <section id="properties" className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
        <div>
          <h2 className="section-heading">
            Which option
            <span className="font-serif-accent block normal-case text-olive-dark">
              is right for you?
            </span>
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted">{helper?.body}</p>
      </div>

      <Tabs
        value={active}
        onValueChange={(v) => onChange(v as PropertyCategory)}
        className="mt-10"
      >
        <TabsList>
          {data.categories.map((cat) => (
            <TabsTrigger key={cat.slug} value={cat.slug}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  )
}
