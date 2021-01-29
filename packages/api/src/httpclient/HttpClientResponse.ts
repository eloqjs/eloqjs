export interface HttpClientResponse {
  getData<T = unknown>(): T

  getUnderlying(): unknown
}
