export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export function formatTime(time: string) {
  const [hour = '0', minute = '0'] = time.split(':')
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2025, 0, 1, Number(hour), Number(minute)))
}

export function toDateInput(date = new Date()) {
  return date.toISOString().slice(0, 10)
}
