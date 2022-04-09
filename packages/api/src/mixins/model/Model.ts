import { Model as BaseModel } from '@eloqjs/core'

import { Config } from '../../contracts/Config'
import { HttpClient } from '../../httpclient/HttpClient'
import * as API from '../../model/api'
import { assert } from '../../support/Utils'

export function Model(model: typeof BaseModel, config: Config): void {
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
    this.httpClient = httpClient
  }

  /**
   * Get an [Static API]{@link API.ModelAPIStatic} instance from a static {@link Model}.
   */
  model.api = function <M extends typeof BaseModel>(this: M): API.ModelAPIStatic<M> {
    return new API.ModelAPIStatic(this)
  }

  /**
   * Get an [Instance API]{@link API.ModelAPIInstance} instance from a {@link Model} instance.
   */
  model.prototype.$api = function <M extends BaseModel>(): API.ModelAPIInstance<M> {
    return new API.ModelAPIInstance(this as M)
  }
}
