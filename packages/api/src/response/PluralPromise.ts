import { Model } from '@eloqjs/core'

import { PluralResponse } from './PluralResponse'

export type PluralPromise<M extends Model = Model> = Promise<PluralResponse<M>>
