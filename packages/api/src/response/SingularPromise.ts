import { Model } from '@eloqjs/core'

import { SingularResponse } from './SingularResponse'

export type SingularPromise<M extends Model = Model> = Promise<
  SingularResponse<M>
>
