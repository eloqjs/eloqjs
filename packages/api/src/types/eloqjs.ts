import { Collection, Element, Item } from '@eloqjs/core'

import { HttpClient, HttpClientResponse } from '../httpclient'
import { ModelAPIInstance, ModelAPIStatic } from '../model/api'
import { RelationAPI } from '../relations/api'

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

  interface ModelOptions {
    /**
     * The resource key your elements may be nested under in the response body.
     */
    dataKey?: string

    /**
     * Intercept and transform the response.
     *
     * The method will receive a {@link HttpClientResponse} object allowing you to access response properties such as
     * response headers, as well as manipulate the data as you see fit.
     *
     * @returns {Element|Element[]} The data to pass on. Must be a record for {@link RecordResponse}
     *   and an array of records for {@link CollectionResponse}.
     */
    dataTransformer?: (response: HttpClientResponse) => Element | Element[]
  }

  namespace Relations {
    interface Relation<
      M extends Model = Model,
      D extends Item<M> | Collection<M> = Item<M> | Collection<M>,
      S extends boolean = boolean
    > {
      api(): RelationAPI<M, D, S>
    }

    interface HasOne<M extends Model = Model> {
      api(): RelationAPI<M, Item<M>, true>
    }

    interface HasMany<M extends Model = Model> {
      api(): RelationAPI<M, Collection<M>, false>
    }
  }
}
