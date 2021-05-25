import { Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'

export abstract class Response {
  public readonly httpClientResponse: HttpClientResponse | null

  public abstract readonly data: unknown

  protected readonly model: typeof Model

  public constructor(
    httpClientResponse: HttpClientResponse | null,
    model: typeof Model
  ) {
    this.httpClientResponse = httpClientResponse
    this.model = model
  }
}
