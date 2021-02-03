import { Attributes, Element, Model } from '@eloqjs/core'

import { HasMany as HasManyClass } from '../../relations/HasMany'

export class HasMany extends Attributes.HasMany {
  public constructor(model: typeof Model, related: typeof Model) {
    super(model, related)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value: Element[], parent: Model, key: string): HasManyClass {
    // Ensure that the value is an array of records.
    value = Array.isArray(value) ? value : []

    const data = this.mutate(value)

    return new HasManyClass(this.related, parent, data, key)
  }
}
