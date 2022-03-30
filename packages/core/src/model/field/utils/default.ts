import { isArray, isFunction, isUndefined } from '../../../support/Utils'

type DefaultResolver = {
  key: string
  type: any
  defaultValue: any
}

export function resolveDefault({ key, type, defaultValue }: DefaultResolver): any {
  let _isPrimitive: boolean

  // TODO: Improve `isUndefined` check to avoid duplicated code
  if (isUndefined(defaultValue)) {
    return defaultValue
  }

  if (isArray(type)) {
    _isPrimitive = type.every((_type) => isPrimitive(_type))
  } else {
    _isPrimitive = isPrimitive(type)
  }

  if (!_isPrimitive && !isFunction(defaultValue)) {
    throw new Error(
      `Invalid default value for field "${key}": Fields with type Object/Array must use a factory function to return the default value.`
    )
  }

  return defaultValue
}

export function getDefaultValue<T>(value: T | (() => T)): T {
  return isFunction(value) ? value() : value
}

function isPrimitive(type: any): boolean {
  return type === String || type === Boolean || type === Number || type === BigInt || type === Symbol
}
