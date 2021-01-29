import { Model as BaseModel } from '@eloqjs/core'

import { API } from '../../api/API'
import { InstanceAPI } from '../../api/InstanceAPI'
import { Config } from '../../contracts/Config'
import { HttpClient } from '../../httpclient/HttpClient'
import { assert } from '../../support/Utils'

export function Model(model: typeof BaseModel, config: Config): void {
  // @ts-ignore
  API._httpClient = config.httpClient || null

  model.httpClient = config.httpClient || null

  /**
   * Allows you to get the current HTTP client (AxiosHttpClient by default), e.g. to alter its configuration.
   */
  model.getHttpClient = function (): HttpClient {
    assert(!!this.httpClient, [
      'The http client instance is not registered. Please register the http client instance to the model.'
    ])

    return this.httpClient
  }

  /**
   * Allows you to use any HTTP client library, as long as you write a wrapper for it that implements the interfaces
   * {@link HttpClient}, {@link HttpClientPromise} and {@link HttpClientResponse}.
   *
   * @param httpClient
   */
  model.setHttpClient = function (httpClient: HttpClient): void {
    // @ts-ignore
    API._httpClient = httpClient
    this.httpClient = httpClient
  }

  /**
   * Get an {@link API} instance from a static {@link Model}.
   */
  model.api = function <M extends typeof BaseModel>(this: M): API<M> {
    return new API(this)
  }

  /**
   * Get an {@link InstanceAPI} instance from a {@link Model} instance.
   */
  model.prototype.$api = function <M extends BaseModel>(): InstanceAPI<M> {
    return new InstanceAPI(this as M)
  }
}
