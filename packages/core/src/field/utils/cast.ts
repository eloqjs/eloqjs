import { isArray, isFunction, isUndefined } from '../../support/Utils'

export function resolveCast(key: string, type: any, cast: any): any {
  // TODO: Improve `isUndefined` check to avoid duplicated code
  if (isUndefined(cast)) {
    return cast
  }

  if (isArray(type) && !isFunction(cast)) {
    throw new Error(
      `Invalid cast for field "${key}": The cast must be a Function when multiple types are defined.`
    )
  }

  if (cast === true) {
    return (value: any) => castValue(type, value)
  }

  return (value: any) => castValue(cast, value)
}

function castValue(cast: any, value: any) {
  if (isClass(cast)) {
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
