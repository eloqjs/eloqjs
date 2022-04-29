import { Model } from '../model'
import { isArray, isFunction, isString } from './is'
import { Variadic } from './types'

/**
 * Variadic helper function.
 */
export function variadic<T, U = T[]>(data: Variadic<T, U>): U {
  if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0])) {
    return data[0] as U
  }

  return data as unknown as U
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
 * Resolves the value from the given model.
 */
export function resolveValue<T = unknown, M extends Model = Model>(model: M, predicate: string | ((model: M) => T)): T {
  if (isFunction(predicate)) {
    return predicate(model)
  }

  return model[predicate]
}

/**
 * Force the data to be an array.
 *
 * @param data
 */
export function forceArray<T>(data: T | T[]): T[] {
  return isArray(data) ? data : [data]
}

/**
 * Asserts that the condition is truthy, throwing immediately if not.
 */
export function assert(condition: boolean, message: string[]): asserts condition {
  if (!condition) {
    throw new Error(['[ELOQJS]'].concat(message).join(' '))
  }
}

/**
 * Clone the given value by stringifying and parsing it.
 *
 * @param value The value to be cloned.
 * @param reviver If a function, this prescribes how the value originally produced by parsing is transformed, before
 *   being returned.
 */
export function clone(value: unknown, reviver?: ((key: string, value: any) => any) | undefined) {
  return JSON.parse(JSON.stringify(value), reviver)
}

export function capitalize(value: string): string {
  if (!isString(value)) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}
