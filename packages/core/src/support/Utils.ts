import { Model } from '../model/Model'

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

/**
 * Determines whether the given value is the type of `function`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

/**
 * Determines whether the given value is the type of `object`.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && !isArray(value) && !isNull(value)
}

/**
 * Determines whether the given value is the type of `array`.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Determines whether the given value is the type of `string`.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Determines whether the given value is the type of `number`.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/**
 * Determines whether the given value is the type of `boolean`.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Determines whether the given value is the type of `null`.
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Determines whether the given value is the type of `undefined`.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * Determines whether the given value is the type of `undefined` or `null`.
 */
export function isNullish(value: unknown): value is undefined | null {
  return isUndefined(value) || isNull(value)
}

/**
 * Determines whether the given value is the instance of {@link Model}.
 */
export function isModel(value: unknown): value is Model {
  return isObject(value) && value instanceof Model
}

/**
 * Determines whether the given array or object is empty.
 */
export function isEmpty(
  collection: unknown[] | Record<string, unknown>
): boolean {
  return size(collection) === 0
}

/**
 * Gets the size of collection by returning its length for array-like values
 * or the number of own enumerable string keyed properties for objects.
 */
export function size(collection: unknown[] | Record<string, unknown>): number {
  return isArray(collection)
    ? collection.length
    : Object.keys(collection).length
}
