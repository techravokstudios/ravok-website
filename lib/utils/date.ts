/**
 * Date manipulation and formatting utilities
 */

export function formatDate(date: Date | string, format: string = 'MMM dd, yyyy'): string {
  const d = new Date(date)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthAbbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayAbbrs = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const map: Record<string, number | string> = {
    MMMM: monthNames[d.getMonth()],
    MMM: monthAbbrs[d.getMonth()],
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    M: d.getMonth() + 1,
    dddd: dayNames[d.getDay()],
    ddd: dayAbbrs[d.getDay()],
    dd: String(d.getDate()).padStart(2, '0'),
    d: d.getDate(),
    yyyy: d.getFullYear(),
    yy: String(d.getFullYear()).slice(-2),
    h: d.getHours() % 12 || 12,
    hh: String(d.getHours() % 12 || 12).padStart(2, '0'),
    H: d.getHours(),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    m: d.getMinutes(),
    ss: String(d.getSeconds()).padStart(2, '0'),
    s: d.getSeconds(),
    a: d.getHours() >= 12 ? 'PM' : 'AM',
    A: d.getHours() >= 12 ? 'pm' : 'am',
  }

  // Replace longest tokens first to avoid partial matches
  return format.replace(/\b(MMMM|MMM|MM|M|yyyy|yy|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|A|a)\b/g, (match) => String(map[match]))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
}

export function isToday(date: Date | string): boolean {
  const today = new Date()
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

export function isFuture(date: Date | string): boolean {
  return new Date(date) > new Date()
}

export function isPast(date: Date | string): boolean {
  return new Date(date) < new Date()
}

export function getDateRange(startDate: Date | string, endDate: Date | string): {
  days: number
  weeks: number
  months: number
} {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMs = end.getTime() - start.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  return { days, weeks, months }
}
