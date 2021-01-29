import { Model } from '../../model/Model'
import { Attribute } from '../Attribute'
import { Mutator } from '../Contracts'

export abstract class Type extends Attribute {
  /**
   * Whether if the attribute can accept `null` as a value.
   */
  public isNullable: boolean = false

  /**
   * The mutator for the field.
   */
  public mutator?: Mutator<any>

  /**
   * Create a new type instance.
   */
  public constructor(
    model: typeof Model,
    value: unknown,
    mutator?: Mutator<any>
  ) {
    super(model)

    this.value = value
    this.mutator = mutator
  }

  /**
   * Set `isNullable` to be `true`.
   */
  public nullable(): this {
    this.isNullable = true

    return this
  }

  /**
   * Mutate the given value by mutator.
   */
  public mutate(value: unknown, key: string): unknown {
    const mutator = this.mutator || this.model.mutators()[key]

    return mutator ? mutator(value) : value
  }
}
