import { Collection } from '../collection/Collection'
import { Model } from '../model/Model'
import { Item } from '../types'

export class Relation<
  M extends Model = Model,
  D extends Item<M> | Collection<M> = Item<M> | Collection<M>,
  S extends boolean = boolean
> {
  public data: D

  public model: typeof Model

  public belongsToModel: Model

  public key: string

  /**
   * If true, then this function will in all cases return a singular item. This is used by HasOne relation, which
   * when queried spawn a Builder with this property set to true.
   */
  public forceSingular: boolean

  public constructor(model: typeof Model, belongsToModel: Model, data: D, key: string, forceSingular: S) {
    this.model = model
    this.belongsToModel = belongsToModel
    this.data = data
    this.key = key
    this.forceSingular = forceSingular
  }
}
