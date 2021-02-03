import { Collection, Model } from '@eloqjs/core'

import { RelationAPI } from './RelationAPI'

export class HasManyAPI<M extends Model = Model> extends RelationAPI<M, false> {
  /**
   * If true, then this function will in all cases return a {@link SingularResponse}.
   */
  protected static forceSingular: boolean = false

  public data: Collection<M>

  public constructor(
    model: typeof Model,
    parent: Model,
    data: Collection<M>,
    key: string
  ) {
    super(model, parent, key)

    this.data = data
  }
}
