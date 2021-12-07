import { isFunction, isUndefined } from '../../../support/Utils'

type ValidatorResolver = {
  key: string
  validator: any
  fallback: (value: any) => boolean
}

export function resolveValidator({
  key,
  validator,
  fallback
}: ValidatorResolver): (value: any) => boolean {
  if (!isUndefined(validator) && !isFunction(validator)) {
    throw new Error(
      `Invalid validator for field "${key}": The validator must be a Function.`
    )
  }

  return validator || fallback
}
