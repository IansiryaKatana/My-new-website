import { useMemo, useState } from 'react'
import { useCms } from '@/contexts/CmsContext'
import type { PropertyCategory } from '@/lib/cms/types'
import { PropertyFilter } from './PropertyFilter'
import { PropertyCard } from './PropertyCard'

export function PropertyListings() {
  const { data } = useCms()
  const [category, setCategory] = useState<PropertyCategory>('loft')

  const filtered = useMemo(
    () => data.properties.filter((p) => p.category === category),
    [data.properties, category],
  )

  const display =
    filtered.length > 0 ? filtered : data.properties.slice(0, 3)

  return (
    <>
      <PropertyFilter active={category} onChange={setCategory} />
      <div className="space-y-0">
        {display.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  )
}
