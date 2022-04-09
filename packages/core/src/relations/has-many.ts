import { Collection } from '../collection'
import { Model } from '../model'
import { Relation } from './relation'

export type HasMany<M extends Model = Model> = Relation<M, Collection<M>, false>
