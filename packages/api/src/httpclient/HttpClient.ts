import { HttpClientOptions } from './HttpClientOptions'
import { HttpClientPromise } from './HttpClientPromise'

export interface HttpClient {
  setBaseUrl(baseUrl: string): void

  /**
   * `withCredentials` indicates whether or not cross-site Access-Control requests
   * should be made using credentials.
   *
   * @param withCredentials
   */
  setWithCredentials(withCredentials: boolean): void

  get(url: string, config?: HttpClientOptions): HttpClientPromise

  delete(url: string, config?: HttpClientOptions): HttpClientPromise

  head(url: string, config?: HttpClientOptions): HttpClientPromise

  post(
    url: string,
    data?: unknown,
    config?: HttpClientOptions
  ): HttpClientPromise

  put(
    url: string,
    data?: unknown,
    config?: HttpClientOptions
  ): HttpClientPromise

  patch(
    url: string,
    data?: unknown,
    config?: HttpClientOptions
  ): HttpClientPromise

  getImplementingClient(): unknown
}
