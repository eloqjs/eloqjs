import { isPlainObject } from '../support/Utils'

function isUnallowedValue(value: unknown): boolean {
  return (
    value === undefined ||
    value instanceof RegExp ||
    typeof value === 'function'
  )
}

export function mapQuery(
  obj: Record<string, any>,
  path: string[] = [],
  map: Map<string[], any> = new Map()
): Map<string[], any> {
  if (!isPlainObject(obj)) {
    if (path.length === 0) {
      throw new Error('The filter query must be an object.')
    }

    map.set(path, obj)

    return map
  }

  const keys = Object.keys(obj)

  for (const name of keys) {
    const value: any = obj[name]

    // Remove unallowed values
    if (isUnallowedValue(value)) continue

    mapQuery(value, [...path, name], map)
  }

  return map
}
