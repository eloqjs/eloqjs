import { Model } from '../../model/Model'
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
    if (value === undefined) {
      return this.value as number | null
    }

    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string') {
      return parseFloat(value)
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    if (value === null && this.isNullable) {
      return value
    }

    return 0
  }
}
