import { Model } from '../model/Model'
import { Element } from '../types/Data'

export abstract class Attribute {
  /**
   * The model that this attributes is being registered.
   */
  public model: typeof Model

  /**
   * The default value of the field.
   */
  public value: unknown

  /**
   * Create a new attribute instance.
   */
  public constructor(model: typeof Model) {
    this.model = model
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public abstract make(
    value: unknown,
    parent: Element,
    key: string,
    mutate?: boolean
  ): unknown
}
