import { Model } from '../model/Model'
import { Collection, Item } from '../types/Data'

export abstract class Relation<M extends Model = Model> {
  public abstract data: Item<M> | Collection<M>

  public model: typeof Model

  public belongsToModel: Model

  public key: string

  protected constructor(
    model: typeof Model,
    belongsToModel: Model,
    key: string
  ) {
    this.model = model
    this.belongsToModel = belongsToModel
    this.key = key
  }
}
