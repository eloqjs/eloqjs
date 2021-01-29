import { Model } from '../model/Model'
import { Item } from '../types/Data'
import { Relation } from './Relation'

export class HasOne<M extends Model = Model> extends Relation<M> {
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
