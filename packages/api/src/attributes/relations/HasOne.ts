import { Attributes, Element, Model } from '@eloqjs/core'

import { Relation as CRelation } from '../../relations'

export class HasOne extends Attributes.HasOne {
  public constructor(model: typeof Model, related: typeof Model) {
    super(model, related)
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  public make(value: Element, parent: Model, key: string): CRelation {
    const data = this.mutate(value)

    return new CRelation(this.related, parent, data, key, true)
  }
}
