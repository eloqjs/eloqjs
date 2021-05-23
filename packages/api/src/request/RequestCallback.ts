import { HttpClientResponse } from '@eloqjs/api'

import { RequestOperation } from './RequestOperation'

export type OnRequestCallback = () => Promise<RequestOperation | boolean>

export type OnRequestSuccessCallback = (
  response: HttpClientResponse | null
) => void

export type OnRequestFailureCallback = (
  error: any,
  response: HttpClientResponse | undefined
) => void

export type onRequestFinishCallback = () => void
