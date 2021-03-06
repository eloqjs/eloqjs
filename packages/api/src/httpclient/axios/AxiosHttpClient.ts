import axios, { AxiosInstance } from 'axios'

import { isNullish } from '../../support/Utils'
import { HttpClient } from '../HttpClient'
import { HttpClientPromise } from '../HttpClientPromise'
import { AxiosHttpClientPromise } from './AxiosHttpClientPromise'

export class AxiosHttpClient implements HttpClient {
  private readonly axiosInstance: AxiosInstance

  public constructor(axiosInstance?: AxiosInstance) {
    if (isNullish(axiosInstance)) {
      axiosInstance = axios.create()
      axiosInstance.defaults.headers['Accept'] = 'application/vnd.api+json'
      axiosInstance.defaults.headers['Content-type'] =
        'application/vnd.api+json'
    }

    this.axiosInstance = axiosInstance
  }

  public setBaseUrl(baseUrl: string): void {
    if (!baseUrl) {
      return
    }

    this.axiosInstance.defaults.baseURL = baseUrl
  }

  public setWithCredentials(withCredentials: boolean): void {
    this.axiosInstance.defaults.withCredentials = withCredentials
  }

  public get(url: string): HttpClientPromise {
    return new AxiosHttpClientPromise(this.axiosInstance.get(url))
  }

  public delete(url: string): HttpClientPromise {
    return new AxiosHttpClientPromise(this.axiosInstance.delete(url))
  }

  public head(url: string): HttpClientPromise {
    return new AxiosHttpClientPromise(this.axiosInstance.head(url))
  }

  public post(url: string, data?: unknown): HttpClientPromise {
    return new AxiosHttpClientPromise(this.axiosInstance.post(url, data))
  }

  public put(url: string, data?: unknown): HttpClientPromise {
    return new AxiosHttpClientPromise(this.axiosInstance.put(url, data))
  }

  public patch(url: string, data?: unknown): HttpClientPromise {
    return new AxiosHttpClientPromise(this.axiosInstance.patch(url, data))
  }

  public getImplementingClient(): AxiosInstance {
    return this.axiosInstance
  }
}
