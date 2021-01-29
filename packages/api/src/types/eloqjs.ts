import { API } from '../api/API'
import { InstanceAPI } from '../api/InstanceAPI'
import { HttpClient } from '../httpclient/HttpClient'
// import { Model as ModelAPI } from '../model/Model'

declare module '@eloqjs/core' {
  namespace Model {
    /**
     * The http client of the model.
     */
    export let httpClient: HttpClient | null

    /**
     * Allows you to get the current HTTP client (AxiosHttpClient by default), e.g. to alter its configuration.
     */
    export function getHttpClient(): HttpClient

    /**
     * Allows you to use any HTTP client library, as long as you write a wrapper for it that implements the interfaces
     * {@link HttpClient}, {@link HttpClientPromise} and {@link HttpClientResponse}.
     *
     * @param httpClient
     */
    export function setHttpClient(httpClient: HttpClient): void

    /**
     * Get an {@link API} instance from a static {@link Model}.
     */
    export function api<M extends typeof Model>(this: M): API<M>
  }

  interface Model {
    /**
     * Get an {@link InstanceAPI} instance from a {@link Model} instance.
     */
    $api<M extends this>(): InstanceAPI<M>
  }
}
