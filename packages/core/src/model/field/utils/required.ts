import { isNullish } from '../../../support/Utils'

type RequiredResolver = {
  required: any
}

export function resolveRequired({ required }: RequiredResolver): boolean {
  return required === true
}

export function isRequired(key: string, value: any, required: boolean): true {
  if (isNullish(value) && required) {
    throw new Error(`Field ${key} is required.`)
  }

  return true
}
