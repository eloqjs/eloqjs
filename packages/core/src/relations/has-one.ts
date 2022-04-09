import { Model } from '../model'
import { Item } from '../types'
import { Relation } from './relation'

export type HasOne<M extends Model = Model> = Relation<M, Item<M>, true>
