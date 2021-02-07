import { Model } from '../../model/Model'
import { Uid as UidGenerator } from '../../support/Uid'
import { Type } from './Type'

export class Uid extends Type {
  /**
   * Create a new uid instance.
   */
  public constructor(model: typeof Model, value?: unknown) {
    super(model, value)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value?: unknown): string | number {
    if (typeof value === 'number' || typeof value === 'string') {
      return value
    }

    if (typeof this.value === 'function') {
      return this.value()
    }

    return UidGenerator.make()
  }
}
