import axios, { AxiosInstance } from 'axios'

import { isNullish } from '../../support/Utils'
import { HttpClient } from '../HttpClient'
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

  public get(url: string): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.get(url))
  }

  public delete(url: string): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.delete(url))
  }

  public head(url: string): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.head(url))
  }

  public post(url: string, data?: unknown): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.post(url, data))
  }

  public put(url: string, data?: unknown): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.put(url, data))
  }

  public patch(url: string, data?: unknown): HttpClientPromise {
    return new AxiosHttpClientPromise(this._axiosInstance.patch(url, data))
  }

  public getImplementingClient(): AxiosInstance {
    return this._axiosInstance
  }
}
