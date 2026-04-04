/**
 * Array manipulation utilities
 */

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function unique<T>(array: T[], key?: (item: T) => unknown): T[] {
  if (!key) {
    return Array.from(new Set(array))
  }
  const seen = new Set()
  return array.filter((item) => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => flat.concat(item), [])
}

export function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = key(item)
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

export function sortBy<T>(array: T[], key: (item: T) => string | number | boolean | null | undefined, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = key(a)
    const bVal = key(b)

    if (aVal == null && bVal == null) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

export function findIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) return i
  }
  return -1
}

export function remove<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter((item) => !predicate(item))
}

export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)]
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function paginate<T>(array: T[], page: number, pageSize: number): {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
} {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = array.slice(start, end)
  const total = array.length
  const totalPages = Math.ceil(total / pageSize)

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
