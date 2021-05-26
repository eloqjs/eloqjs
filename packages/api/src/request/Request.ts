import { Model } from '@eloqjs/core'
import merge from 'merge'

import {
  HttpClient,
  HttpClientPromise,
  HttpClientResponse
} from '../httpclient'
import { HttpClientOptions } from '../httpclient/HttpClientOptions'
import { assert, isFunction } from '../support/Utils'
import {
  OnRequestCallback,
  OnRequestFailureCallback,
  onRequestFinishCallback,
  OnRequestSuccessCallback
} from './RequestCallback'
import { RequestMethod } from './RequestMethod'
import { RequestOperation } from './RequestOperation'
import { RequestOptions } from './RequestOptions'

export class Request<M extends typeof Model = typeof Model> {
  /**
   * The type of the model.
   */
  protected model: M

  /**
   * The request config.
   */
  private _config: Partial<HttpClientOptions> = {}

  /**
   * Create a new api instance.
   */
  public constructor(model: M, config: Partial<RequestOptions> = {}) {
    this.model = model
    this.setConfig(config)
  }

  /**
   * Allows you to get the current HTTP client, e.g. to alter its configuration.
   */
  public getHttpClient(): HttpClient {
    return this.model.getHttpClient()
  }

  /**
   * Allows you to use any HTTP client library, as long as you write a wrapper for it that implements the interfaces
   * {@link HttpClient}, {@link HttpClientPromise} and {@link HttpClientResponse}.
   */
  public setHttpClient(httpClient: HttpClient): HttpClient {
    this.model.setHttpClient(httpClient)

    return this.getHttpClient()
  }

  /**
   * Allows you to get the current request config.
   */
  public getConfig(): Partial<HttpClientOptions> {
    return this._config
  }

  /**
   * Allows you to set the current request config.
   */
  public setConfig(config: Partial<HttpClientOptions>): void {
    merge.recursive(this._config, config)
  }

  public request(
    config: RequestOptions | (() => RequestOptions),
    onRequest: OnRequestCallback,
    onSuccess?: OnRequestSuccessCallback,
    onFailure?: OnRequestFailureCallback,
    onFinish?: onRequestFinishCallback
  ): Promise<HttpClientResponse | null> {
    return new Promise(
      (resolve, reject): Promise<void> => {
        return onRequest()
          .then((status): Promise<void> | void => {
            switch (status) {
              case RequestOperation.REQUEST_CONTINUE:
                break
              case RequestOperation.REQUEST_SKIP:
                return
              case RequestOperation.REQUEST_REDUNDANT: // Skip, but consider it a success.
                if (isFunction(onSuccess)) {
                  onSuccess(null)
                }

                resolve(null)
                return
            }

            // Support passing the request configuration as a function, to allow
            // for deferred resolution of certain values that may have changed
            // during the call to "onRequest".
            if (isFunction(config)) {
              config = config()
            }

            // Make the request
            return this._resolveRequest(config)
              .then((response): void => {
                if (isFunction(onSuccess)) {
                  onSuccess(response)
                }

                resolve(response)
              })
              .catch((error) => {
                if (isFunction(onFailure)) {
                  onFailure(error, error.response)
                }

                reject(error)
              })
              .catch(reject) // For errors that occur in `onFailure`.
              .finally(onFinish)
          })
          .catch(reject)
      }
    )
  }

  private _resolveRequest({
    url,
    method,
    data
  }: RequestOptions): HttpClientPromise {
    assert(!!url && !!method, [
      'The request is missing the URL and the METHOD.'
    ])

    let promise: HttpClientPromise

    switch (method) {
      case RequestMethod.GET:
        promise = this.getHttpClient().get(url, this.getConfig())
        break
      case RequestMethod.DELETE:
        promise = this.getHttpClient().delete(url, this.getConfig())
        break
      case RequestMethod.HEAD:
        promise = this.getHttpClient().head(url, this.getConfig())
        break
      case RequestMethod.POST:
        promise = this.getHttpClient().post(url, data, this.getConfig())
        break
      case RequestMethod.PUT:
        promise = this.getHttpClient().put(url, data, this.getConfig())
        break
      case RequestMethod.PATCH:
        promise = this.getHttpClient().patch(url, data, this.getConfig())
        break
      default:
        throw new Error('[ELOQJS] The request METHOD is invalid.')
    }

    return promise
  }
}
