import { isFunction, isUndefined } from '../../../support/Utils'

type AccessorResolver = {
  key: string
  accessor: any
  fallback: (value: any) => any
}

export function resolveAccessor({ key, accessor, fallback }: AccessorResolver): (value: any) => any {
  if (!isUndefined(accessor) && !isFunction(accessor)) {
    throw new Error(`Invalid accessor for field "${key}": The accessor must be a Function.`)
  }

  return accessor || fallback
}
