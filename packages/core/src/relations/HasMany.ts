import { Collection } from '../collection/Collection'
import { Model } from '../model/Model'
import { Relation } from './Relation'

export type HasMany<M extends Model = Model> = Relation<M, Collection<M>, false>
