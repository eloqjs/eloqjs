import { isString } from '../../../support/Utils'

export function attributeReviver(_key: string, value: unknown): unknown {
  const dateRegex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/

  // Revive date objects
  if (isString(value) && dateRegex.test(value)) {
    return new Date(value)
  }

  return value
}
