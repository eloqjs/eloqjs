import { Relation } from '../../../relations'
import { isCollection, isModel } from '../../../utils/is'

export function isRelationDirty(relation: Relation) {
  if (isCollection(relation.data)) {
    return relation.data.models.some((model) => model.$isDirty())
  }

  if (isModel(relation.data)) {
    return relation.data.$isDirty()
  }

  return false
}
