import axios, { AxiosInstance } from 'axios'

import { isNullish } from '../../support/Utils'
import { HttpClient } from '../HttpClient'
import { HttpClientOptions } from '../HttpClientOptions'
import { HttpClientPromise } from '../HttpClientPromise'
import { AxiosHttpClientPromise } from './AxiosHttpClientPromise'

export class AxiosHttpClient implements HttpClient {
  private readonly _axiosInstance: AxiosInstance

  public constructor(axiosInstance?: AxiosInstance) {
    if (isNullish(axiosInstance)) {
      axiosInstance = axios.create()
      axiosInstance.defaults.headers['Accept'] = 'application/vnd.api+json'
      axiosInstance.defaults.headers['Content-type'] =
        'application/vnd.api+json'
    }

    this._axiosInstance = axiosInstance
  }

  public setBaseUrl(baseUrl: string): void {
    if (!baseUrl) {
      return
    }

    this._axiosInstance.defaults.baseURL = baseUrl
  }

  public setWithCredentials(withCredentials: boolean): void {
    this._axiosInstance.defaults.withCredentials = withCredentials
  }

  public get(url: string, config?: HttpClientOptions): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.get(url, config))
  }

  public delete(url: string, config?: HttpClientOptions): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.delete(url, config))
  }

  public head(url: string, config?: HttpClientOptions): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.head(url, config))
  }

  public post(
    url: string,
    data?: unknown,
    config?: HttpClientOptions
  ): HttpClientPromise {
    return new AxiosHttpClientPromise(
      this._axiosInstance.post(url, data, config)
    )
  }

  public put(
    url: string,
    data?: unknown,
    config?: HttpClientOptions
  ): HttpClientPromise {
    return new AxiosHttpClientPromise(
      this._axiosInstance.put(url, data, config)
    )
  }

  public patch(
    url: string,
    data?: unknown,
    config?: HttpClientOptions
  ): HttpClientPromise {
    return new AxiosHttpClientPromise(
      this._axiosInstance.patch(url, data, config)
    )
  }

  public getImplementingClient(): AxiosInstance {
    return this._axiosInstance
  }
}
