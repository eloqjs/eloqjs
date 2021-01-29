import { Model } from '../model/Model'
import { Collection } from '../types/Data'
import { Relation } from './Relation'

export class HasMany<M extends Model = Model> extends Relation<M> {
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
