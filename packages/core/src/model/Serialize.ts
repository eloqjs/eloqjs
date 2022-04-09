import { Collection, SerializedCollection } from '../collection/Collection'
import { Element, Item } from '../types'
import { isArray, isCollection, isNull, isPlainObject } from '../utils/is'
import { Model, ModelOptions } from './Model'

export interface SerializeModelOptions {
  /**
   * Whether the relationships should be serialized.
   */
  relations?: boolean
}

export interface SerializedModel {
  entity: string
  options: ModelOptions
  attributes: {
    data: Record<string, any>
    reference: Record<string, any>
    changes: Record<string, any>
  }
  relationships: Record<string, SerializedModel | SerializedCollection>
}

export const defaultOptions: Required<SerializeModelOptions> = {
  relations: true
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

  if (isPlainObject(v)) {
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
export function relation(relation: Item | Collection): SerializedModel | SerializedCollection | null {
  if (isNull(relation)) {
    return null
  }

  if (isCollection(relation)) {
    return relation.serialize()
  }

  return relation.$serialize()
}

/**
 * Serialize given relation into empty json.
 */
export function emptyRelation(relation: Item | Collection): [] | null {
  return isCollection(relation) ? [] : null
}

/**
 * Get the attributes of the given relation.
 */
export function getRelationAttributes(relation: Item | Collection, isRequest: boolean = false): Element | Element[] | null {
  if (isNull(relation)) {
    return null
  }

  function resolve(model: Model) {
    if (isRequest) {
      return {
        [model.$primaryKey]: model.$id
      }
    }

    return model.$getAttributes()
  }

  if (isCollection(relation)) {
    return relation.models.map((model) => resolve(model))
  }

  return resolve(relation)
}

export function isSerializedModel(serializedModel: any): serializedModel is SerializedModel {
  return (
    !!serializedModel &&
    !!serializedModel.entity &&
    !!serializedModel.options &&
    !!serializedModel.attributes &&
    !!serializedModel.relationships
  )
}
