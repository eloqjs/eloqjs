import { Model } from '../../model/Model'
import { Element } from '../../types/Data'
import { Mutator } from '../Contracts'
import { Type } from './Type'

export class Boolean extends Type {
  /**
   * Create a new number instance.
   */
  public constructor(
    model: typeof Model,
    value: unknown,
    mutator?: Mutator<boolean | null>
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
  ): boolean | null {
    const localValue = this.fix(value)

    if (!mutate) {
      return localValue
    }

    return this.mutate(localValue, key) as boolean | null
  }

  /**
   * Transform given data to the boolean.
   */
  public fix(value: unknown): boolean | null {
    if (value === undefined) {
      return this.value as boolean | null
    }

    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'string') {
      if (value.length === 0) {
        return false
      }

      const int = parseInt(value, 0)

      return isNaN(int) ? true : !!int
    }

    if (typeof value === 'number') {
      return !!value
    }

    if (value === null && this.isNullable) {
      return value
    }

    return false
  }
}
