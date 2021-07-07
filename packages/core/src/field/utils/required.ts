import { isNullish } from '../../support/Utils'

export function resolveRequired(required: any): boolean {
  return required === true
}

export function isRequired(key: string, value: any, required: boolean): true {
  if (isNullish(value) && required) {
    throw new Error(`Field ${key} is required.`)
  }

  return true
}
