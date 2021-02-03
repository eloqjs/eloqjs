import { Model } from '../../model/Model'
import { HasMany as HasManyClass } from '../../relations/HasMany'
import { Collection, Element } from '../../types/Data'
import { Relation } from './Relation'

export class HasMany extends Relation {
  /**
   * The related model.
   */
  protected related: typeof Model

  public constructor(model: typeof Model, related: typeof Model) {
    super(model)

    this.related = related
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value: Element[], parent: Model, key: string): HasManyClass {
    // Ensure that the value is an array of records.
    value = Array.isArray(value) ? value : []

    const data = this.mutate(value)

    return new HasManyClass(this.related, parent, data, key)
  }

  protected mutate(records: Element[]): Collection {
    // Remove duplicates, by model primary key.
    // collection = collection.unique(this.related.primaryKey)

    return records.map((record) => {
      record = 'data' in record ? (record.data as Element) : record
      return new this.related(record)
    }) as Collection
  }
}
