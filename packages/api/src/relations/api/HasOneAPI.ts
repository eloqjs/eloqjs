import { Item, Model } from '@eloqjs/core'

import { RelationAPI } from './RelationAPI'

export class HasOneAPI<M extends Model = Model> extends RelationAPI<M, true> {
  /**
   * If true, then this function will in all cases return a {@link SingularResponse}. This is used by HasOne relation, which
   * when queried spawn a Builder with this property set to true.
   */
  protected static forceSingular: boolean = true

  public data: Item<M>

  public constructor(
    model: typeof Model,
    parent: Model,
    data: Item<M>,
    key: string
  ) {
    super(model, parent, key)

    this.data = data
  }
}
