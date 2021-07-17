import { RelationEnum } from '../../relations/RelationEnum'
import {
  capitalize,
  isArray,
  isCollection,
  isModelClass,
  isNull,
  isNullish,
  isPlainObject
} from '../../support/Utils'

type TypeResolver = {
  key: string
  type: any
}

export function resolveType({ key, type }: TypeResolver): any {
  if (isNullish(type)) {
    throw new Error(`Invalid type for field ${key}: The type must be defined.`)
  }

  return type
}

export function validateType(
  value: any,
  type: any,
  relation?: RelationEnum
): boolean {
  if (isNullish(value)) {
    return false
  }

  if (relation && isModelClass(type)) {
    switch (relation) {
      case RelationEnum.HAS_ONE: {
        return value instanceof type || isPlainObject(value)
      }
      case RelationEnum.HAS_MANY: {
        return isCollection(value) || isArray(value)
      }
      default: {
        return false
      }
    }
  }

  if (isArray(type)) {
    return type.includes(value.constructor)
  }

  return value.constructor === type
}

export function getExpectedName(type: any, relation?: RelationEnum): string {
  if (isModelClass(type) && relation === RelationEnum.HAS_MANY) {
    return `Collection of ${resolveName(type)}`
  }

  if (isArray(type)) {
    return type.map((_type: any) => resolveName(_type)).join(', ')
  }

  return resolveName(type)
}

export function getGottenName(value: any): string {
  if (isNull(value)) {
    return 'Null'
  }

  if (value && value.constructor) {
    return value.constructor.name
  }

  return capitalize(typeof value)
}

function resolveName(type: any): string {
  return type.name || type.constructor.name
}
