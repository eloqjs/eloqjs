import { Model } from '@eloqjs/core'

import { RecordResponse } from './RecordResponse'

export type RecordPromise<M extends Model = Model> = Promise<RecordResponse<M>>
