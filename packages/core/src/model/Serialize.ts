import { Collection, Element, Item } from '../types/Data'
import { Model } from './Model'

/**
 * Serialize given value.
 */
export function value(v: unknown): unknown {
  if (v === null) {
    return null
  }

  if (Array.isArray(v)) {
    return array(v)
  }

  if (typeof v === 'object') {
    return object(v as Record<string, unknown>)
  }

  return v
}

/**
 * Serialize an array into json.
 */
export function array(a: unknown[]): unknown[] {
  return a.map((v) => value(v))
}

/**
 * Serialize an object into json.
 */
export function object(o: Record<string, unknown>): Record<string, unknown> {
  const obj = {}

  for (const key in o) {
    obj[key] = value(o[key])
  }

  return obj
}

/**
 * Serialize given relation into json.
 */
export function relation(
  relation: Item | Collection,
  isPayload: boolean = false
): Element | Element[] | null {
  if (relation === null) {
    return null
  }

  function resolve(model: Model) {
    if (isPayload) {
      return {
        [model.$primaryKey()]: model.$id
      }
    }

    return model.$toJson()
  }

  if (Array.isArray(relation)) {
    return relation.map((model) => resolve(model))
  }

  return resolve(relation)
}

/**
 * Serialize given relation into empty json.
 */
export function emptyRelation(relation: Item | Collection): [] | null {
  return Array.isArray(relation) ? [] : null
}
