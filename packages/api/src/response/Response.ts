import { Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'

export abstract class Response {
  public readonly httpClientResponse: HttpClientResponse

  public abstract readonly data: unknown

  protected readonly model: typeof Model

  protected constructor(
    httpClientResponse: HttpClientResponse,
    model: typeof Model
  ) {
    this.httpClientResponse = httpClientResponse
    this.model = model
  }
}
