import { Model } from '../model/Model'
import { Collection } from '../types/Data'
import { Relation } from './Relation'

export type HasMany<M extends Model = Model> = Relation<M, Collection<M>, false>
