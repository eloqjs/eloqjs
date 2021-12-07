import { Collection } from '../../../collection/Collection'
import { Relation } from '../../../relations'
import { RelationEnum } from '../../../relations/RelationEnum'
import {
  capitalize,
  isArray,
  isCollection,
  isModel,
  isModelClass
} from '../../../support/Utils'
import { Element, Item } from '../../../types/Data'
import { Model } from '../../Model'

type RelationTypeResolver = {
  key: string
  type: any
  relation: RelationEnum
}

// TODO: Simplify functions
export function resolveRelationType({
  key,
  type,
  relation
}: RelationTypeResolver): RelationEnum | undefined {
  const relations = Object.values(RelationEnum)

  if (isModelClass(type) && !relations.includes(relation)) {
    const expected = relations.join(', ')
    const gotten = capitalize(typeof relation)

    throw new Error(
      `Invalid relation for field ${key}: Expected ${expected}, got ${gotten}.`
    )
  }

  return relation
}

export function resolveRelation(
  parent: Model,
  related: typeof Model,
  relation: RelationEnum,
  key: string,
  value: any
): Relation {
  switch (relation) {
    case RelationEnum.HAS_ONE: {
      const data = mutateHasOne(value, related)

      return new Relation(related, parent, data, key, true)
    }
    case RelationEnum.HAS_MANY: {
      const data = mutateHasMany(value, related)

      return new Relation(related, parent, data, key, false)
    }
    default: {
      const relations = Object.values(RelationEnum)
      const expected = relations.join(' | ')

      throw new Error(
        `Invalid relation for field ${key}: Expected "${expected}", got "${relation}".`
      )
    }
  }
}

export function mutateHasOne(
  record: Model | Element,
  related: typeof Model
): Item {
  if (isModel(record)) {
    return record
  }

  return record ? new related(record) : null
}

export function mutateHasMany(
  records: Collection | Element[],
  related: typeof Model
): Collection {
  if (isCollection(records)) {
    return records
  }

  records = isArray(records) ? records : []

  const collection = new Collection([], {
    model: related
  })

  for (let record of records) {
    // TODO: Improve format support
    record = 'data' in record ? (record.data as Element) : record

    collection.add(record)
  }

  return collection
}
