import { Collection, Element, Item, Model as BaseModel } from '@eloqjs/core'

import { Builder } from '../builder/Builder'
import { HttpClientOptions } from '../httpclient/HttpClientOptions'
import { FilterValue } from '../query/specs/FilterSpec'
import { ParamValue } from '../query/specs/ParamSpec'
import { CollectionPromise } from '../response/CollectionPromise'
import { DeletePromise } from '../response/DeletePromise'
import { RecordPromise } from '../response/RecordPromise'
import { SavePromise } from '../response/SavePromise'
import { assert } from '../support/Utils'
import { ModelAPIInstance, ModelAPIStatic } from './api'

export class Model extends BaseModel {
  /**
   * Get a collection of records.
   */
  public static all<M extends typeof Model, C extends Collection<InstanceType<M>>>(
    this: M,
    collection?: C
  ): CollectionPromise<InstanceType<M>, C> {
    return this._api().all(collection)
  }

  /**
   * Get the first record of a collection of records.
   */
  public static first<M extends typeof Model>(this: M): RecordPromise<InstanceType<M>> {
    return this._api().first()
  }

  /**
   * Find an specific record.
   */
  public static find<M extends typeof Model>(this: M, id: string | number): RecordPromise<InstanceType<M>> {
    return this._api().find(id)
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public static save<M extends typeof Model>(this: M, record: InstanceType<M> | Element): SavePromise<InstanceType<M>> {
    return this._api().save(record)
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {object} query - The query to filter.
   */
  public static where<M extends typeof Model>(this: M, query: Record<string, any>): Builder<InstanceType<M>>

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public static where<M extends typeof Model>(this: M, attribute: string | string[], value: FilterValue): Builder<InstanceType<M>>

  /**
   * @internal
   */
  public static where<M extends typeof Model>(
    this: M,
    attribute: string | string[] | Record<string, any>,
    value?: FilterValue
  ): Builder<InstanceType<M>>

  public static where<M extends typeof Model>(
    this: M,
    attribute: string | string[] | Record<string, any>,
    value?: FilterValue
  ): Builder<InstanceType<M>> {
    return this._api().where(attribute, value)
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {object} query - The query to filter.
   */
  public static whereIn<M extends typeof Model>(this: M, query: Record<string, any>): Builder<InstanceType<M>>

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public static whereIn<M extends typeof Model>(
    this: M,
    attribute: string | string[],
    values: FilterValue[]
  ): Builder<InstanceType<M>>

  /**
   * @internal
   */
  public static whereIn<M extends typeof Model>(
    this: M,
    attribute: string | string[] | Record<string, any>,
    values?: FilterValue[]
  ): Builder<InstanceType<M>>

  public static whereIn<M extends typeof Model>(
    this: M,
    attribute: string | string[] | Record<string, any>,
    values?: FilterValue[]
  ): Builder<InstanceType<M>> {
    return this._api().whereIn(attribute, values)
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public static with<M extends typeof Model>(this: M, relationship: string | string[]): Builder<InstanceType<M>> {
    return this._api().with(relationship)
  }

  /**
   * Alias for the "with" method.
   *
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public static include<M extends typeof Model>(this: M, relationship: string | string[]): Builder<InstanceType<M>> {
    return this.with(relationship)
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public static append<M extends typeof Model>(this: M, attribute: string | string[]): Builder<InstanceType<M>> {
    return this._api().append(attribute)
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public static select<M extends typeof Model>(
    this: M,
    field: string | string[] | Record<string, string | string[]>
  ): Builder<InstanceType<M>> {
    return this._api().select(field)
  }

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {object} query - The query attributes to sort.
   */
  public static orderBy<M extends typeof Model>(this: M, query: Record<string, 'asc' | 'desc'>): Builder<InstanceType<M>>

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {string | string[]} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public static orderBy<M extends typeof Model>(
    this: M,
    attribute: string | string[],
    direction?: 'asc' | 'desc'
  ): Builder<InstanceType<M>>

  /**
   * @internal
   */
  public static orderBy<M extends typeof Model>(
    this: M,
    attribute: string | string[] | Record<string, 'asc' | 'desc'>,
    direction?: 'asc' | 'desc'
  ): Builder<InstanceType<M>>

  public static orderBy<M extends typeof Model>(
    this: M,
    attribute: string | string[] | Record<string, 'asc' | 'desc'>,
    direction?: 'asc' | 'desc'
  ): Builder<InstanceType<M>> {
    return this._api().orderBy(attribute, direction)
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {object} query - The custom query parameters, e.g. '{ bar: 'baz }' in "http://foo.com?bar=baz"
   */
  public static params<M extends typeof Model>(this: M, query: Record<string, any>): Builder<InstanceType<M>>

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {ParamValue | ParamValue[]} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public static params<M extends typeof Model>(
    this: M,
    parameter: string | string[],
    value: ParamValue | ParamValue[]
  ): Builder<InstanceType<M>>

  /**
   * @internal
   */
  public static params<M extends typeof Model>(
    this: M,
    parameter: string | string[] | Record<string, any>,
    value?: ParamValue | ParamValue[]
  ): Builder<InstanceType<M>>

  public static params<M extends typeof Model>(
    this: M,
    parameter: string | string[] | Record<string, any>,
    value?: ParamValue | ParamValue[]
  ): Builder<InstanceType<M>> {
    return this._api().params(parameter, value)
  }

  /**
   * Specify the page that should be fetched.
   *
   * @param {number} page - The number of the page.
   */
  public static page<M extends typeof Model>(this: M, page: number): Builder<InstanceType<M>> {
    return this._api().page(page)
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public static limit<M extends typeof Model>(this: M, limit: number): Builder<InstanceType<M>> {
    return this._api().limit(limit)
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public static custom<M extends typeof Model>(this: M, ...resources: (string | Model)[]): Builder<InstanceType<M>> {
    return this._api().custom(...resources)
  }

  /**
   * Define the configuration of the request.
   *
   * @param {HttpClientOptions} config - The configuration of the request.
   */
  public static config<M extends typeof Model>(this: M, config: Partial<HttpClientOptions>): ModelAPIStatic<M> {
    return this._api().config(config)
  }

  /**
   * Delete a record.
   */
  public static delete(id: string | number): DeletePromise {
    return this._api().delete(id)
  }

  /**
   * Get an [Static API]{@link ModelAPIStatic} instance from a static {@link Model}.
   */
  private static _api<M extends typeof Model>(this: M): ModelAPIStatic<M> {
    assert(!!this.api, ['API is not registered.'])

    return this.api()
  }

  /**
   * Get a {@link Builder} instance from a {@link Model} instance
   * so you can query without having a static reference to your specific {@link Model}
   * class.
   */
  public $query(): Builder<this> {
    return this._$api().query() as Builder<this>
  }

  /**
   * Get a fresh instance of this {@link Model}.
   *
   * @returns A {@link Promise} resolving to:
   *
   * * the representation of this {@link Model} instance in the API if this {@link Model} has an ID and this ID can.
   * be found in the API too
   * * `null` if this {@link Model} instance has no ID or if there _is_ an ID, but a {@link Model} with this ID cannot
   *   be found in the backend.
   */
  public $fresh(): Promise<Item<this>> {
    return this._$api().fresh()
  }

  /**
   * Save or update the record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public $save(): SavePromise<this> {
    return this._$api().save()
  }

  /**
   * Delete the record.
   */
  public $delete(): DeletePromise {
    return this._$api().delete()
  }

  /**
   * Create a related record and attach it to this {@link Model}.
   */
  public $attach<R extends Model>(relationship: R): SavePromise<R> {
    return this._$api().attach(relationship)
  }

  /**
   * Delete a related record and detach it from this {@link Model}.
   */
  public $detach<R extends Model>(relationship: R): DeletePromise {
    return this._$api().detach(relationship)
  }

  /**
   * Update a related record and sync it to this {@link Model}.
   */
  public $sync<R extends Model>(relationship: R): SavePromise<R> {
    return this._$api().sync(relationship)
  }

  /**
   * Create a related record for the provided {@link Model}.
   */
  public $for<T extends Model>(model: T): SavePromise<this> {
    return this._$api().for(model)
  }

  /**
   * Define the configuration of the request.
   *
   * @param {HttpClientOptions} config - The configuration of the request.
   */
  public $config(config: Partial<HttpClientOptions>): ModelAPIInstance<this> {
    return this._$api().config(config)
  }

  /**
   * Get an [Instance API]{@link ModelAPIInstance} instance from a {@link Model}.
   */
  private _$api(): ModelAPIInstance<this> {
    assert(!!this.$api, ['API is not registered.'])

    return this.$api()
  }
}
