import { Model } from '../../model/Model'
import { Relation as CRelation } from '../../relations/Relation'
import { Element } from '../../types/Data'
import { Attribute } from '../Attribute'

export abstract class Relation extends Attribute {
  /**
   * The related model.
   */
  protected related: typeof Model

  protected constructor(model: typeof Model, related: typeof Model) {
    super(model)

    this.related = related
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public abstract make(
    value: Element | Element[],
    parent: Model,
    key: string
  ): CRelation
}
