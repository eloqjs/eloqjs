import { RelationEnum } from '../../relations/RelationEnum'
import {
  isArray,
  isCollection,
  isModelClass,
  isNullish,
  isPlainObject
} from '../../support/Utils'

export function resolveType(key: string, type: any): any {
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

export function getName(type: any): string {
  return isArray(type)
    ? type.map((_type: any) => resolveName(_type)).join(' | ')
    : resolveName(type)
}

function resolveName(type: any): string {
  return type.name || type.constructor.name
}
