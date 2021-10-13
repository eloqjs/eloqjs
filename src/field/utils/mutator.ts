import { isFunction, isUndefined } from '../../support/Utils'

type MutatorResolver = {
  key: string
  mutator: any
  fallback: (value: any) => any
}

export function resolveMutator({
  key,
  mutator,
  fallback
}: MutatorResolver): (value: any) => any {
  if (!isUndefined(mutator) && !isFunction(mutator)) {
    throw new Error(
      `Invalid mutator for field "${key}": The mutator must be a Function.`
    )
  }

  return mutator || fallback
}
