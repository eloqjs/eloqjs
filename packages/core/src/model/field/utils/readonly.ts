type ReadOnlyResolver = {
  readOnly: any
}

export function resolveReadOnly({ readOnly }: ReadOnlyResolver): boolean {
  return readOnly === true
}
