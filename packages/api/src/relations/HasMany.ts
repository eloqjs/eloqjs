import { Collection, Model } from '@eloqjs/core'

import { Relation } from './Relation'

export type HasMany<M extends Model = Model> = Relation<M, Collection<M>, false>
