import { Model } from '@eloqjs/core'

import { Builder } from '../builder/Builder'
import {
  HttpClient,
  HttpClientPromise,
  HttpClientResponse
} from '../httpclient'
import { isFunction } from '../support/Utils'
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
   * Create a new api instance.
   */
  public constructor(model: M) {
    this.model = model
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
   * Get a {@link Builder} instance from {@link Request}
   * so you can start querying.
   */
  public builder(): Builder<InstanceType<M>> {
    return new Builder(this.model)
  }

  public request(
    config: RequestOptions | (() => RequestOptions),
    onRequest: OnRequestCallback,
    onSuccess: OnRequestSuccessCallback,
    onFailure: OnRequestFailureCallback,
    onFinish: onRequestFinishCallback
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
                onSuccess(null)
                resolve(null)
                return
            }

            if (isFunction(config)) {
              config = config()
            }

            return this._resolveRequest(config)
              .then((response): void => {
                onSuccess(response)
                resolve(response)
              })
              .catch((error) => {
                onFailure(error, error.response)
                reject(error)
              })
              .catch(reject) // For errors that occur in `onFailure`.
              .finally(onFinish)
          })
          .catch(reject)
      }
    )
  }

  private _resolveRequest(config: RequestOptions): HttpClientPromise {
    let promise: HttpClientPromise

    switch (config.method) {
      case RequestMethod.GET:
        promise = this.getHttpClient().get(config.url)
        break
      case RequestMethod.DELETE:
        promise = this.getHttpClient().delete(config.url)
        break
      case RequestMethod.HEAD:
        promise = this.getHttpClient().head(config.url)
        break
      case RequestMethod.POST:
        promise = this.getHttpClient().post(config.url, config.data)
        break
      case RequestMethod.PUT:
        promise = this.getHttpClient().put(config.url, config.data)
        break
      case RequestMethod.PATCH:
        promise = this.getHttpClient().patch(config.url, config.data)
        break
      default:
        throw new Error('Invalid request method.')
    }

    return promise
  }
}
