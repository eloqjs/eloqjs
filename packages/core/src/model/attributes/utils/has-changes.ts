/**
 * Determine if any of the given attributes were changed.
 */
import { isEmpty } from '../../../support/Utils'

export function hasChanges(data: Record<string, any>, changes: Record<string, any>, attributes: string[] = []): boolean {
  attributes = attributes.filter((attribute) => Object.keys(data).includes(attribute))

  // If no specific attributes were provided, we will just see if the dirty array
  // already contains any attributes. If it does we will just return that this
  // count is greater than zero. Else, we need to check specific attributes.
  if (isEmpty(attributes)) {
    return Object.keys(changes).length > 0
  }

  // Here we will spin through every attribute and see if this is in the array of
  // dirty attributes. If it is, we will return true and if we make it through
  // all of the attributes for the entire array we will return false at end.
  for (const attribute of attributes) {
    if (attribute in changes) {
      return true
    }
  }

  return false
}
