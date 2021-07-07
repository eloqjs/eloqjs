import { isFunction, isUndefined } from '../../support/Utils'

export function resolveValidator(
  key: string,
  validator: any,
  fallback: (value: any) => boolean
): (value: any) => boolean {
  if (!isUndefined(validator) && !isFunction(validator)) {
    throw new Error(
      `Invalid validator for field "${key}": The validator must be a Function.`
    )
  }

  return validator || fallback
}
