import { isArray, isFunction, isUndefined } from '../../support/Utils'

type CastResolver = {
  key: string
  type: any
  cast: any
}

export function resolveCast({ key, type, cast }: CastResolver): any {
  if (isUndefined(cast)) {
    return cast
  }

  if (isArray(type)) {
    if (isFunction(cast)) {
      return (value: any) => cast(value)
    }

    throw new Error(
      `Invalid cast for field "${key}": The cast must be a Function when multiple types are defined.`
    )
  }

  if (cast === true) {
    return (value: any) => castValue(type, value)
  }

  throw new Error(
    `Invalid cast for field "${key}": The cast must match the field type.`
  )
}

function castValue(cast: any, value: any) {
  if (isClass(cast) || cast === Date) {
    return new cast(value)
  }

  return cast(value)
}

function isClass(obj: any) {
  const isCtorClass =
    obj.constructor && obj.constructor.toString().substring(0, 5) === 'class'
  if (obj.prototype === undefined) {
    return isCtorClass
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class'
  return isCtorClass || isPrototypeCtorClass
}
