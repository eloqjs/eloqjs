import { Model } from '../../model/Model'
import { HasOne as HasOneClass } from '../../relations/HasOne'
import { Element, Item } from '../../types/Data'
import { Relation } from './Relation'

export class HasOne extends Relation {
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
  public make(value: Element, parent: Model, key: string): HasOneClass {
    const data = this.mutate(value)

    return new HasOneClass(this.related, parent, data, key)
  }

  private mutate(record: Element): Item {
    return record ? new this.related(record) : null
  }
}
