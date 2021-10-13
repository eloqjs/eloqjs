import { Collection } from '../../collection/Collection'
import { Model } from '../../model/Model'
import { Relation as CRelation } from '../../relations'
import { isArray } from '../../support/Utils'
import { Element } from '../../types/Data'
import { Relation } from './Relation'

export class HasMany extends Relation {
  public constructor(model: typeof Model, related: typeof Model) {
    super(model, related)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value: Element[], parent: Model, key: string): CRelation {
    // Ensure that the value is an array of records.
    value = this.fix(value)

    const data = this.mutate(value)

    return new CRelation(this.related, parent, data, key, false)
  }

  protected fix(value: Element | Element[]): Element[] {
    // Ensure that the value is an array of records.
    return isArray(value) ? value : []
  }

  protected mutate(records: Element[]): Collection {
    const collection = new Collection([], {
      model: this.related
    })

    for (let record of records) {
      // TODO: Improve format support
      record = 'data' in record ? (record.data as Element) : record

      collection.add(record)
    }

    return collection
  }
}
