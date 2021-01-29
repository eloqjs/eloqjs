export type Wrapped<T> = { data: T }

/**
 * Variadic helper function.
 *
 * @param data
 */
export function variadic<T>(data: T | T[]): T {
  if (Array.isArray(data)) {
    return data[0]
  }

  return data
}

/**
 * Unwrap helper function.
 *
 * @param data
 */
export function unwrap<T>(data: T | { data: T }): T {
  return data && 'data' in data ? (data.data as T) : (data as T)
}

/**
 * Force the data to be an array.
 *
 * @param data
 */
export function forceArray<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data]
}

/**
 * Asserts that the condition is truthy, throwing immediately if not.
 */
export function assert(
  condition: boolean,
  message: string[]
): asserts condition {
  if (!condition) {
    throw new Error(['[ELOQJS]'].concat(message).join(' '))
  }
}
