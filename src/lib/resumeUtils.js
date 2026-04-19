export const isEmpty = (val) =>
  !val || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)

export const formatDateRange = (startDate, endDate, current) => {
  if (!startDate && !endDate && !current) return ''
  const start = startDate || ''
  const end = current ? 'Present' : (endDate || '')
  if (!start && !end) return ''
  if (!start) return end
  if (!end) return start
  return `${start} – ${end}`
}

export const getInitials = (fullName) => {
  if (!fullName) return ''
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
