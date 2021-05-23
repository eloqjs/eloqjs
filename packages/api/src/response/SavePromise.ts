import { Model } from '@eloqjs/core'

import { SaveResponse } from './SaveResponse'

export type SavePromise<
  M extends Model = Model
> = Promise<SaveResponse<M> | null>
