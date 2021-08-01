import { Collection } from '../collection/Collection'
import { isArray, isCollection, isNull, isObject } from '../support/Utils'
import { Element, Item } from '../types/Data'
import { Model } from './Model'

export interface SerializeOptions {
  /**
   * Whether the relationships should be serialized.
   * If set to `false`, only ID's will be included.
   */
  relations?: boolean

  /**
   * Whether the serialization is for a request.
   */
  isRequest?: boolean

  /**
   * Whether the request is a PATCH request.
   */
  shouldPatch?: boolean
}

export const defaultOptions: Required<SerializeOptions> = {
  relations: true,
  isRequest: false,
  shouldPatch: false
}

/**
 * Serialize given value.
 */
export function value(v: unknown): unknown {
  if (isNull(v)) {
    return null
  }

  if (isArray(v)) {
    return array(v)
  }

  if (isObject(v)) {
    return object(v)
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
  isRequest: boolean = false
): Element | Element[] | null {
  if (isNull(relation)) {
    return null
  }

  function resolve(model: Model) {
    if (isRequest) {
      return {
        [model.$primaryKey]: model.$id
      }
    }

    return model.$toJson()
  }

  if (isCollection(relation)) {
    return relation.models.map((model) => resolve(model))
  }

  return resolve(relation)
}

/**
 * Serialize given relation into empty json.
 */
export function emptyRelation(relation: Item | Collection): [] | null {
  return isArray(relation) ? [] : null
}
