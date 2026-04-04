/**
 * Object manipulation utilities
 */

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result as Omit<T, K>
}

export function merge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  return { ...target, ...source }
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

export function hasKey<T extends Record<string, unknown>>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj
}

export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0
}

export function invert<T extends Record<string, string>>(obj: T): Record<string, string> {
  return Object.keys(obj).reduce(
    (result, key) => {
      result[obj[key]] = key
      return result
    },
    {} as Record<string, string>
  )
}

export function values<T extends Record<string, unknown>>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][]
}

export function entries<T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  return Object.keys(obj).reduce(
    (result, key) => {
      result[key as keyof T] = fn(obj[key as keyof T], key as keyof T)
      return result
    },
    {} as Record<keyof T, R>
  )
}
