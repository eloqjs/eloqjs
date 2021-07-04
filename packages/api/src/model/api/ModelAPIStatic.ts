import { Collection, Element, Model } from '@eloqjs/core'
import defu from 'defu'

import { Builder } from '../../builder/Builder'
import { HttpClientOptions } from '../../httpclient/HttpClientOptions'
import { Operation } from '../../operation/Operation'
import { FilterValue } from '../../query/specs/FilterSpec'
import { ParamValue } from '../../query/specs/ParamSpec'
import { CollectionPromise } from '../../response/CollectionPromise'
import { DeletePromise } from '../../response/DeletePromise'
import { RecordPromise } from '../../response/RecordPromise'
import { SavePromise } from '../../response/SavePromise'
import { isModel, isNumber, isString } from '../../support/Utils'

export class ModelAPIStatic<M extends typeof Model = typeof Model> {
  /**
   * The type of the model.
   */
  protected model: M

  private _config: Partial<HttpClientOptions> = {}

  /**
   * Create a new api instance.
   */
  public constructor(model: M) {
    this.model = model
  }

  /**
   * Get a collection of records.
   */
  public all<C extends Collection<InstanceType<M>>>(
    collection?: C
  ): CollectionPromise<InstanceType<M>, C> {
    return this._query().get(collection) as CollectionPromise<
      InstanceType<M>,
      C
    >
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): RecordPromise<InstanceType<M>> {
    return this._query().first()
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): RecordPromise<InstanceType<M>> {
    return this._query().find(id)
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {object} query - The query to filter.
   */
  public where(query: Record<string, any>): Builder<InstanceType<M>>

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(
    attribute: string | string[],
    value: FilterValue
  ): Builder<InstanceType<M>>

  /**
   * @internal
   */
  public where(
    attribute: string | string[] | Record<string, any>,
    value?: FilterValue
  ): Builder<InstanceType<M>>

  public where(
    attribute: string | string[] | Record<string, any>,
    value?: FilterValue
  ): Builder<InstanceType<M>> {
    return this._query().where(attribute, value)
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {object} query - The query to filter.
   */
  public whereIn(query: Record<string, any>): Builder<InstanceType<M>>

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(
    attribute: string | string[],
    values: FilterValue[]
  ): Builder<InstanceType<M>>

  /**
   * @internal
   */
  public whereIn(
    attribute: string | string[] | Record<string, any>,
    values?: FilterValue[]
  ): Builder<InstanceType<M>>

  public whereIn(
    attribute: string | string[] | Record<string, any>,
    values?: FilterValue[]
  ): Builder<InstanceType<M>> {
    return this._query().whereIn(attribute, values)
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): Builder<InstanceType<M>> {
    return this._query().with(relationship)
  }

  /**
   * Alias for the "with" method.
   *
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public include(relationship: string | string[]): Builder<InstanceType<M>> {
    return this.with(relationship)
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
   * @param {ParamValue | ParamValue[]} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public params(
    parameter: string | Record<string, ParamValue | ParamValue[]>,
    value?: ParamValue | ParamValue[]
  ): Builder<InstanceType<M>> {
    return this._query().params(parameter, value)
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
   * Define the configuration of the request.
   *
   * @param {HttpClientOptions} config - The configuration of the request.
   */
  public config(config: Partial<HttpClientOptions>): this {
    this._config = defu(config, this._config)

    return this
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public save(record: InstanceType<M> | Element): SavePromise<InstanceType<M>> {
    const model = this._instantiate(record)

    return this._operation(model).save()
  }

  public delete(record: InstanceType<M> | Element): DeletePromise

  public delete(id: string | number): DeletePromise

  /**
   * Delete a record.
   */
  public delete(
    record: InstanceType<M> | Element | string | number
  ): DeletePromise {
    // If an ID was passed, assign it to model's primary key
    if (isString(record) || isNumber(record)) {
      record = { [this.model.primaryKey]: record }
    }

    const model = this._instantiate(record)

    return this._operation(model).delete()
  }

  private _operation(
    model: InstanceType<M>,
    config?: Partial<HttpClientOptions>
  ): Operation<InstanceType<M>> {
    return new Operation(model, config).config(this._getConfig())
  }

  /**
   * Get a {@link Builder} instance from {@link ModelAPIStatic}
   * so you can start querying.
   */
  private _query(): Builder<InstanceType<M>> {
    return new Builder<InstanceType<M>>(this.model).config(this._getConfig())
  }

  /**
   * Get the current request config.
   */
  private _getConfig(): Partial<HttpClientOptions> {
    return this._config
  }

  private _instantiate(record: InstanceType<M> | Element): InstanceType<M> {
    return isModel(record)
      ? record
      : (new this.model(record) as InstanceType<M>)
  }
}
