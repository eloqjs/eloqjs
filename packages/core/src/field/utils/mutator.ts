import { isFunction, isUndefined } from '../../support/Utils'

export function resolveMutator(
  key: string,
  mutator: any,
  fallback: (value: any) => any
): (value: any) => any {
  if (!isUndefined(mutator) && !isFunction(mutator)) {
    throw new Error(
      `Invalid mutator for field "${key}": The mutator must be a Function.`
    )
  }

  return mutator || fallback
}
