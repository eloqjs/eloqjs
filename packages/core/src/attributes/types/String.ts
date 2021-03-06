import { Model } from '../../model/Model'
import { isNull, isString, isUndefined } from '../../support/Utils'
import { Element } from '../../types/Data'
import { Mutator } from '../Contracts'
import { Type } from './Type'

export class String extends Type {
  /**
   * Create a new string instance.
   */
  public constructor(
    model: typeof Model,
    value: unknown,
    mutator?: Mutator<string | null>
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
  ): string | null {
    const localValue = this.fix(value)

    if (!mutate) {
      return localValue
    }

    return this.mutate(localValue, key) as string | null
  }

  /**
   * Convert given value to the string.
   */
  public fix(value: unknown): string | null {
    if (isUndefined(value)) {
      return this.value as string | null
    }

    if (isString(value)) {
      return value
    }

    if (isNull(value) && this.isNullable) {
      return value
    }

    return value + ''
  }
}
