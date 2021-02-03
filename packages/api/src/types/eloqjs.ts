import { HttpClient } from '../httpclient/HttpClient'
import { ModelAPIInstance, ModelAPIStatic } from '../model/api'
import { HasManyAPI, HasOneAPI } from '../relations/api'

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
     * Get an [Static API]{@link ModelAPIStatic} instance from a static {@link Model}.
     */
    export function api<M extends typeof Model>(this: M): ModelAPIStatic<M>
  }

  interface Model {
    /**
     * Get an [Instance API]{@link ModelAPIInstance} instance from a {@link Model} instance.
     */
    $api<M extends this>(): ModelAPIInstance<M>
  }

  namespace Relations {
    interface HasOne<M extends Model = Model> {
      api(): HasOneAPI<M>
    }

    interface HasMany<M extends Model = Model> {
      api(): HasManyAPI<M>
    }
  }
}
