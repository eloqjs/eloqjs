import { Item, Model } from '@eloqjs/core'

import { Relation } from './Relation'

export type HasOne<M extends Model = Model> = Relation<M, Item<M>, true>
