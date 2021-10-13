import { Model } from '../../model/Model'
import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined
} from '../../support/Utils'
import { Element } from '../../types/Data'
import { Mutator } from '../Contracts'
import { Type } from './Type'

export class Number extends Type {
  /**
   * Create a new number instance.
   */
  public constructor(
    model: typeof Model,
    value: unknown,
    mutator?: Mutator<number | null>
  ) {
    super(model, value, mutator)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(
    value: unknown,
    _parent: Element,
    key: string,
    mutate: boolean = true
  ): number | null {
    const localValue = this.fix(value)

    if (!mutate) {
      return localValue
    }

    return this.mutate(localValue, key) as number | null
  }

  /**
   * Transform given data to the number.
   */
  public fix(value: unknown): number | null {
    if (isUndefined(value)) {
      return this.value as number | null
    }

    if (isNumber(value)) {
      return value
    }

    if (isString(value)) {
      return parseFloat(value)
    }

    if (isBoolean(value)) {
      return value ? 1 : 0
    }

    if (isNull(value) && this.isNullable) {
      return value
    }

    return 0
  }
}
