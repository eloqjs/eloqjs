import { Element, Model } from '@eloqjs/core'

import { HttpClientResponse } from '../httpclient/HttpClientResponse'
import { isFunction } from '../support/Utils'

export type ResponseData<T = Element | Element[]> = T | null

export abstract class Response {
  public readonly httpClientResponse: HttpClientResponse | null

  public abstract readonly data: unknown

  protected readonly model: typeof Model

  public constructor(httpClientResponse: HttpClientResponse | null, model: typeof Model) {
    this.httpClientResponse = httpClientResponse
    this.model = model
  }

  /**
   * Get the response data from the HTTP client response object. If a `dataTransformer`
   * option is configured, it will be applied to the response object. If the
   * `dataKey` option is configured, it will return the data from the given
   * property within the response body.
   */
  protected getDataFromResponse<T = Element | Element[]>(): ResponseData<T> {
    if (!this.httpClientResponse) {
      return null
    }

    const dataTransformer = this.model.options().dataTransformer

    if (isFunction(dataTransformer)) {
      const responseData = dataTransformer(this.httpClientResponse) as ResponseData<T>

      return responseData || null
    }

    const dataKey = this.model.options().dataKey

    if (dataKey) {
      const responseData = this.httpClientResponse.getData<Element>()

      return (responseData[dataKey] || null) as ResponseData<T>
    }

    return this.httpClientResponse.getData<ResponseData<T>>() || null
  }
}
