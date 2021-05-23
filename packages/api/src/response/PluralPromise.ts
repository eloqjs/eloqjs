import { Collection, Model } from '@eloqjs/core'

import { PluralResponse } from './PluralResponse'

export type PluralPromise<
  M extends Model = Model,
  C extends Collection<M> = Collection<M>
> = Promise<PluralResponse<M, C> | null>
