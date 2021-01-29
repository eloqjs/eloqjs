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

  get(url: string): HttpClientPromise

  delete(url: string): HttpClientPromise

  head(url: string): HttpClientPromise

  post(url: string, data?: unknown): HttpClientPromise

  put(url: string, data?: unknown): HttpClientPromise

  patch(url: string, data?: unknown): HttpClientPromise

  getImplementingClient(): unknown
}
