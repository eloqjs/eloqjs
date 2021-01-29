import { Model } from '../../model/Model'
import { Relation as RelationClass } from '../../relations/Relation'
import { Element } from '../../types/Data'
import { Attribute } from '../Attribute'

export abstract class Relation extends Attribute {
  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public abstract make(
    value: Element | Element[],
    parent: Model,
    key: string
  ): RelationClass
}
