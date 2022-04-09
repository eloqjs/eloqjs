import { isArray, isFunction, isUndefined } from '../../../utils/is'

type CastResolver = {
  key: string
  type: any
  cast: any
}

export function resolveCast({ key, type, cast }: CastResolver): any {
  if (isUndefined(cast)) {
    return cast
  }

  if (isClass(cast)) {
    return (value: any) => new cast(value)
  }

  if (isConstructor(cast) || isFunction(cast)) {
    return (value: any) => cast(value)
  }

  if (cast === true) {
    if (isArray(type)) {
      throw new Error(
        `Invalid cast for field "${key}": The cast must be either a Function or a Constructor when multiple types are defined.`
      )
    }

    return (value: any) => castValue(type, value)
  }

  throw new Error(`Invalid cast for field "${key}": The cast must match the field type.`)
}

function castValue(cast: any, value: any) {
  if (isClass(cast) || cast === Date) {
    if (value instanceof Date) {
      return value
    }

    return new cast(value)
  }

  return cast(value)
}

function isClass(obj: any) {
  const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class'
  if (obj.prototype === undefined) {
    return isCtorClass
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class'
  return isCtorClass || isPrototypeCtorClass
}

function isConstructor(type: any): boolean {
  return typeof type === 'function' && type.prototype && type.prototype.constructor === type
}
