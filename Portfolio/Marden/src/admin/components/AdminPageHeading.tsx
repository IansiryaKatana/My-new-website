export function AdminPageHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold text-[var(--admin-text)]">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-[var(--admin-muted)]">{description}</p>
      )}
    </div>
  )
}
