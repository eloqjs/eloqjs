import { Element, Model, ModelOptions } from '@eloqjs/core'

import { Builder } from '../../builder/Builder'
import { HttpClient } from '../../httpclient/HttpClient'
import { FilterValue } from '../../query/specs/FilterSpec'
import { OptionValue } from '../../query/specs/OptionSpec'
import { PluralPromise } from '../../response/PluralPromise'
import { SingularPromise } from '../../response/SingularPromise'
import { SingularResponse } from '../../response/SingularResponse'
import { assert } from '../../support/Utils'

export class ModelAPIStatic<M extends typeof Model = typeof Model> {
  /**
   * The http client of the model.
   */
  private static _httpClient: HttpClient | null

  /**
   * The type of the model.
   */
  protected model: M

  /**
   * Create a new api instance.
   */
  public constructor(model: M) {
    this.model = model
  }

  /**
   * Allows you to get the current HTTP client (AxiosHttpClient by default), e.g. to alter its configuration.
   */
  public static getHttpClient(): HttpClient {
    assert(!!this._httpClient, [
      'The http client instance is not registered. Please register the http client instance to the model.'
    ])

    return this._httpClient
  }

  /**
   * Allows you to use any HTTP client library, as long as you write a wrapper for it that implements the interfaces
   * {@link HttpClient}, {@link HttpClientPromise} and {@link HttpClientResponse}.
   *
   * @param httpClient
   */
  public static setHttpClient(httpClient: HttpClient): void {
    this._httpClient = httpClient
  }

  /**
   * Get a collection of records.
   */
  public all(): PluralPromise<InstanceType<M>> {
    return this._query().get() as PluralPromise<InstanceType<M>>
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): SingularPromise<InstanceType<M>> {
    return this._query().first()
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): SingularPromise<InstanceType<M>> {
    return this._query().find(id)
  }

  public where(
    attribute: string | string[],
    value: FilterValue
  ): Builder<InstanceType<M>> {
    return this._query().where(attribute, value)
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(
    attribute: string | string[],
    values: FilterValue[]
  ): Builder<InstanceType<M>> {
    return this._query().whereIn(attribute, values)
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): Builder<InstanceType<M>> {
    return this._query().with(relationship)
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public append(attribute: string | string[]): Builder<InstanceType<M>> {
    return this._query().append(attribute)
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public select(field: string | string[]): Builder<InstanceType<M>> {
    return this._query().select(field)
  }

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {string} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public orderBy(
    attribute: string,
    direction?: 'asc' | 'desc'
  ): Builder<InstanceType<M>> {
    return this._query().orderBy(attribute, direction)
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {string} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public option(
    parameter: string,
    value: OptionValue | OptionValue[]
  ): Builder<InstanceType<M>> {
    return this._query().option(parameter, value)
  }

  /**
   * Specify the page that should be fetched.
   *
   * @param {number} page - The number of the page.
   */
  public page(page: number): Builder<InstanceType<M>> {
    return this._query().page(page)
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public limit(limit: number): Builder<InstanceType<M>> {
    return this._query().limit(limit)
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public custom(...resources: (string | Model)[]): Builder<InstanceType<M>> {
    return this._query().custom(...resources)
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public save(
    record: InstanceType<M> | Element
  ): SingularPromise<InstanceType<M>> {
    return this.model.hasId(record)
      ? this._update(record)
      : this._create(record)
  }

  /**
   * Delete a record.
   */
  public delete(id: string | number): Promise<void> {
    return this._self()
      .getHttpClient()
      .delete(this.model.getResource() + '/' + id)
      .then(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
  }

  /**
   * Create a record.
   */
  private _create(
    record: InstanceType<M> | Element
  ): SingularPromise<InstanceType<M>> {
    record = this._serialize(record, { isPayload: true })
    const isEmpty = Object.keys(record).length === 0

    assert(!isEmpty, [
      'Cannot create a new record, because no data was provided.'
    ])

    return this._self()
      .getHttpClient()
      .post(this.model.getResource(), record)
      .then((response) => {
        return new SingularResponse<InstanceType<M>>(response, this.model)
      })
  }

  /**
   * Update a record.
   */
  private _update(
    record: InstanceType<M> | Element
  ): SingularPromise<InstanceType<M>> {
    // Get ID before serialize, otherwise the ID may not be available.
    const id = this.model.getIdFromRecord(record)
    record = this._serialize(record, { isPayload: true, isPatch: true })

    return this._self()
      .getHttpClient()
      .patch(this.model.getResource() + '/' + id, record)
      .then((response) => {
        return new SingularResponse<InstanceType<M>>(response, this.model)
      })
  }

  /**
   * Get a {@link Builder} instance from {@link ModelAPIStatic}
   * so you can start querying.
   */
  private _query(): Builder<InstanceType<M>> {
    return new Builder(this.model)
  }

  private _self(): typeof ModelAPIStatic {
    return this.constructor as typeof ModelAPIStatic
  }

  private _serialize(
    record: InstanceType<M> | Element,
    options: ModelOptions = {}
  ): Element {
    const model =
      record instanceof Model
        ? record
        : (new this.model(record) as InstanceType<M>)

    return this.model.serialize(model, options)
  }
}
