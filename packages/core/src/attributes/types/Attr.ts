import { Model } from '../../model/Model'
import { Element } from '../../types/Data'
import { Mutator } from '../Contracts'
import { Type } from './Type'

export class Attr extends Type {
  /**
   * Create a new attr instance.
   */
  public constructor(
    model: typeof Model,
    value: unknown,
    mutator?: Mutator<unknown>
  ) {
    super(model, value, mutator)
  }

  /**
   * Make value to be set to model property. This method is used when
   * instantiating a model or creating a plain object from a model.
   */
  public make(
    value: unknown,
    _parent: Element,
    key: string,
    mutate: boolean = true
  ): unknown {
    value = value !== undefined ? value : this.value

    // Default Value might be a function (taking no parameter).
    let localValue = value

    if (typeof value === 'function') {
      localValue = value()
    }

    if (!mutate) {
      return localValue
    }

    return this.mutate(localValue, key)
  }
}
