import { Collection, SerializedCollection } from '../collection/Collection'
import { Model } from '../model/Model'

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
export function isPlainObject(value: unknown): value is Record<string, unknown> {
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
 * Determines whether the given value is the instance of {@link Model}.
 */
export function isModelClass(value: unknown): value is typeof Model {
  return isFunction(value) && value.prototype instanceof Model
}

/**
 * Determines whether the given value is the instance of {@link Collection}.
 */
export function isCollection(value: unknown): value is Collection {
  return isObject(value) && value instanceof Collection
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
export function isEmpty(collection: unknown[] | Record<string, unknown>): boolean {
  return size(collection) === 0
}

/**
 * Determines whether the given values are equal or not.
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== typeof b) {
    return false
  }

  if ((isArray(a) || isPlainObject(a)) && (isArray(b) || isPlainObject(b)) && size(a) !== size(b)) {
    return false
  }

  if (isArray(a) && isArray(b)) {
    return a.every((val, index) => JSON.stringify(val) === JSON.stringify(b[index]))
  }

  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * Gets the size of collection by returning its length for array-like values
 * or the number of own enumerable string keyed properties for objects.
 */
export function size(collection: unknown[] | Record<string, unknown>): number {
  return isArray(collection) ? collection.length : Object.keys(collection).length
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

export function isSerializedCollection(serializedCollection: any): serializedCollection is SerializedCollection {
  return !!serializedCollection && !!serializedCollection.options && !!serializedCollection.models
}
