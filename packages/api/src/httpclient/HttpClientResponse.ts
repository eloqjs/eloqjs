export interface HttpClientResponse {
  getData<T = any>(): T

  getUnderlying(): any
}
