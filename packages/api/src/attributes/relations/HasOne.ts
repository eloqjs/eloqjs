import { Attributes, Element, Model } from '@eloqjs/core'

import { HasOne as HasOneClass } from '../../relations/HasOne'

export class HasOne extends Attributes.HasOne {
  public constructor(model: typeof Model, related: typeof Model) {
    super(model, related)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value: Element, parent: Model, key: string): HasOneClass {
    const data = this.mutate(value)

    return new HasOneClass(this.related, parent, data, key)
  }
}
