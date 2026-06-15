export function AdminPageHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-medium text-[#3f432d]">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-[#8b897f]">{description}</p>
      )}
    </div>
  )
}
