import { Model } from '../../model/Model'
import { Uid as UidGenerator } from '../../support/Uid'
import { isFunction, isNumber, isString } from '../../support/Utils'
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
    if (isNumber(value) || isString(value)) {
      return value
    }

    if (isFunction(this.value)) {
      return this.value()
    }

    return UidGenerator.make()
  }
}
