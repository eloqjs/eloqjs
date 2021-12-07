import { Model } from '@eloqjs/core'

export type Wrapped<T> = { data: T }

/**
 * Variadic helper function.
 *
 * @param data
 */
export function variadic<T>(data: T | T[]): T {
  if (isArray(data)) {
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
  return isArray(data) ? data : [data]
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
 * Determines whether the given value is the type of `object`, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * Based on [Lodash#isPlainObject]{@link https://github.com/lodash/lodash/blob/master/isPlainObject.js} (MIT)
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (!isObject(value) || getTag(value) != '[object Object]') {
    return false
  }

  if (isNull(Object.getPrototypeOf(value))) {
    return true
  }

  let proto = value

  while (!isNull(Object.getPrototypeOf(proto))) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(value) === proto
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
 * Determines whether the given string is empty.
 */
export function isEmptyString(value: string): boolean {
  return value === ''
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

/**
 * Gets the `toStringTag` of `value`.
 *
 * @param value The value to query.
 * @returns Returns the `toStringTag`.
 *
 * Based on
 * [Lodash#internal#getTag]{@link https://github.com/lodash/lodash/blob/2f79053d7bc7c9c9561a30dda202b3dcd2b72b90/.internal/getTag.js}
 * (MIT)
 */
function getTag(value: unknown): string {
  if (value == null) {
    return isUndefined(value) ? '[object Undefined]' : '[object Null]'
  }
  return Object.prototype.toString.call(value)
}
