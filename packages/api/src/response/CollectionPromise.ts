import { Collection, Model } from '@eloqjs/core'

import { CollectionResponse } from './CollectionResponse'

export type CollectionPromise<M extends Model = Model, C extends Collection<M> = Collection<M>> = Promise<
  CollectionResponse<M, C>
>
