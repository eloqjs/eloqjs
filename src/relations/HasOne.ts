import { Model } from '../model/Model'
import { Item } from '../types/Data'
import { Relation } from './Relation'

export type HasOne<M extends Model = Model> = Relation<M, Item<M>, true>
