import { Model } from '../../model/Model'
import { Relation as CRelation } from '../../relations'
import { Element, Item } from '../../types/Data'
import { Relation } from './Relation'

export class HasOne extends Relation {
  public constructor(model: typeof Model, related: typeof Model) {
    super(model, related)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value: Element, parent: Model, key: string): CRelation {
    const data = this.mutate(value)

    return new CRelation(this.related, parent, data, key, true)
  }

  protected mutate(record: Element): Item {
    return record ? new this.related(record) : null
  }
}
