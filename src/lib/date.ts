import i18n from '@/i18n'

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

function locale(): string {
  return i18n.language === 'ar' ? 'ar-EG' : 'en-GB'
}

function parts(value: string | Date) {
  if (value instanceof Date) {
    return { day: value.getDate(), month: value.getMonth(), year: value.getFullYear() }
  }
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return { day, month: month - 1, year }
}

/** `YYYY-MM-DD` in local time. */
export function toDateKey(date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** True for a `YYYY-MM-DD` date key; anything else is not a date. */
export function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && DATE_KEY.test(value)
}

/** Midday local time for a date key, so a DST change cannot move the day. */
export function parseDateKey(value: string): Date {
  return new Date(`${value}T12:00:00`)
}

/** Add (or subtract) `days` from a date key and return a new date key. */
export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

/** Localized short weekday for a Monday=0 weekday index (Python convention). */
export function weekdayShort(weekday: number): string {
  const monday = new Date(Date.UTC(2024, 0, 1))
  const date = new Date(monday)
  date.setUTCDate(monday.getUTCDate() + (((weekday % 7) + 7) % 7))
  return new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(date)
}

export function formatShortDate(value: string | Date): string {
  const { day, month, year } = parts(value)
  return new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short' }).format(
    new Date(year, month, day)
  )
}

export function formatLongDate(value: string | Date): string {
  const { day, month, year } = parts(value)
  return new Intl.DateTimeFormat(locale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, day))
}

export function formatShortTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale(), { hour: '2-digit', minute: '2-digit' }).format(date)
}

/** Time for today, localized short date for anything older. */
export function formatDayTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return toDateKey(date) === toDateKey() ? formatShortTime(date) : formatShortDate(date)
}
