import { Collection, Model } from '@eloqjs/core'

import { HttpClientOptions } from '../httpclient/HttpClientOptions'
import { Query } from '../query/Query'
import { AppendSpec, FieldSpec, IncludeSpec, LimitSpec, PageSpec, SortSpec } from '../query/specs'
import { FilterSpec, FilterValue } from '../query/specs/FilterSpec'
import { ParamSpec, ParamValue } from '../query/specs/ParamSpec'
import { Request } from '../request/Request'
import { RequestMethod } from '../request/RequestMethod'
import { RequestOperation } from '../request/RequestOperation'
import { CollectionPromise } from '../response/CollectionPromise'
import { CollectionResponse } from '../response/CollectionResponse'
import { RecordPromise } from '../response/RecordPromise'
import { RecordResponse } from '../response/RecordResponse'
import { assert, forceArray, isArray, isObject, isPlainObject, isString, isUndefined } from '../support/Utils'
import { isUnallowedValue, mapQuery } from './MapQuery'
import { SortDirection } from './SortDirection'

export class Builder<M extends Model = Model, S extends boolean = false> {
  protected model: typeof Model

  private readonly _query: Query

  private readonly _requestHandler: Request

  /**
   * If true, then this function will in all cases return a {@link RecordResponse}. This is used by HasOne relation,
   * which when queried spawn a Builder with this property set to true.
   */
  private readonly _forceSingular: boolean

  public constructor(
    model: typeof Model,
    belongsToModel?: typeof Model,
    belongsToModelId?: string | number,
    forceSingular?: boolean
  ) {
    this.model = model

    const resource = belongsToModel ? belongsToModel.getResource() : model.getResource()
    const relatedResource = belongsToModel ? model.getResource() : undefined

    this._query = new Query(resource, relatedResource, belongsToModelId)
    this._requestHandler = new Request(this.model)
    this._forceSingular = !!forceSingular
  }

  /**
   * Get a collection of records.
   */
  public get<C extends Collection<M>>(collection?: C): S extends true ? RecordPromise<M> : CollectionPromise<M, C>
  public get<C extends Collection<M>>(collection?: C): RecordPromise<M> | CollectionPromise<M, C> {
    if (this._forceSingular) {
      return this.first()
    }

    let pluralResponse: CollectionResponse<M, C>

    return <CollectionPromise<M, C>>this._requestHandler
      .request(
        {
          url: this._query.toString(),
          method: RequestMethod.GET
        },
        () => {
          return new Promise((resolve) => {
            return resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          pluralResponse = new CollectionResponse(response, this.model, collection)
        }
      )
      .then(() => pluralResponse)
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): RecordPromise<M> {
    let singularResponse: RecordResponse<M>

    return this._requestHandler
      .request(
        {
          url: this._query.toString(),
          method: RequestMethod.GET
        },
        () => {
          return new Promise((resolve) => {
            return resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          singularResponse = new RecordResponse(response, this.model)
        }
      )
      .then(() => singularResponse)
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): RecordPromise<M> {
    this._query.setIdToFind(id)

    return this.first()
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {object} query - The query to filter.
   */
  public where(query: Record<string, any>): this

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(attribute: string | string[], value: FilterValue): this

  /**
   * @internal
   */
  public where(attribute: string | string[] | Record<string, any>, value?: FilterValue): this

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(attribute: string | string[] | Record<string, any>, value?: FilterValue): this {
    assert(!isUndefined(attribute), ['The `attribute` and `value` of `where` are required.'])

    assert(!isArray(value) && !isObject(value), ['The `value` of `where` must be primitive.'])

    if (isPlainObject(attribute)) {
      for (const [attr, val] of mapQuery(attribute)) {
        this.where(attr, val)
      }
    } else if (value) {
      this._query.addFilter(new FilterSpec(attribute, value))
    } else {
      assert(!isUndefined(value), ['The `value` of `where` is required.'])
    }

    return this
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {object} query - The query to filter.
   */
  public whereIn(query: Record<string, any>): this

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(attribute: string | string[], values: FilterValue[]): this

  /**
   * @internal
   */
  public whereIn(attribute: string | string[] | Record<string, any>, values?: FilterValue[]): this

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(attribute: string | string[] | Record<string, any>, values?: FilterValue[]): this {
    assert(!isUndefined(attribute), ['The `attribute` and `values` of `whereIn` are required.'])

    assert(isUndefined(values) || isArray(values), ['The `value` of `whereIn` must be an array of primitives.'])

    if (isPlainObject(attribute)) {
      for (const [attr, val] of mapQuery(attribute)) {
        this.whereIn(attr, val)
      }
    } else if (values) {
      for (const value of values) {
        this._query.addFilter(new FilterSpec(attribute, value))
      }
    } else {
      assert(!isUndefined(values), ['The `values` of `whereIn` is required.'])
    }

    return this
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): this {
    relationship = forceArray(relationship)

    for (const relation of relationship) {
      this._query.addInclude(new IncludeSpec(relation))
    }

    return this
  }

  /**
   * Alias for the "with" method.
   *
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public include(relationship: string | string[]): this {
    return this.with(relationship)
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public append(attribute: string | string[]): this {
    attribute = forceArray(attribute)

    for (const attr of attribute) {
      this._query.addAppend(new AppendSpec(attr))
    }

    return this
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public select(field: string | string[] | Record<string, string | string[]>): this {
    assert(!isUndefined(field), ['The `field` of `select` is required.'])

    const addFields = (fields: string | string[], key: string = this.model.entity): void => {
      fields = forceArray(fields)

      for (const field of fields) {
        this._query.addField(new FieldSpec(key, field))
      }

      return
    }

    // Single entity .select(['age', 'firstname'])
    if (isArray(field) || isString(field)) {
      addFields(field)
    }

    // Related entities .select({ posts: ['title', 'content'], user: ['age', 'firstname'] })
    if (isObject(field)) {
      Object.entries(field).forEach(([key, fields]) => {
        addFields(fields, key)
      })
    }

    return this
  }

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {object} query - The query attributes to sort.
   */
  public orderBy(query: Record<string, 'asc' | 'desc'>): this

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {string | string[]} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public orderBy(attribute: string | string[], direction?: 'asc' | 'desc'): this

  /**
   * @internal
   */
  public orderBy(attribute: string | string[] | Record<string, 'asc' | 'desc'>, direction?: 'asc' | 'desc'): this

  public orderBy(attribute: string | string[] | Record<string, 'asc' | 'desc'>, direction?: 'asc' | 'desc'): this {
    const addSort = (attributes: string | string[], dir?: boolean) => {
      attributes = forceArray(attributes)

      for (const attr of attributes) {
        this._query.addSort(new SortSpec(attr, dir))
      }
    }
    const resolveDirection = (dir?: 'asc' | 'desc') => {
      switch (dir) {
        default:
          return undefined
        case SortDirection.ASC:
          return true
        case SortDirection.DESC:
          return false
      }
    }

    if (isString(attribute) || isArray(attribute)) {
      addSort(attribute, resolveDirection(direction))
    }

    if (isPlainObject(attribute)) {
      for (const [attr, dir] of Object.entries(attribute)) {
        addSort(attr, resolveDirection(dir))
      }
    }

    return this
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {object} query - The custom query parameters, e.g. '{ bar: 'baz }' in "http://foo.com?bar=baz"
   */
  public params(query: Record<string, any>): this

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {ParamValue | ParamValue[]} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public params(parameter: string | string[], value: ParamValue | ParamValue[]): this

  /**
   * @internal
   */
  public params(parameter: string | string[] | Record<string, any>, value?: ParamValue | ParamValue[]): this

  public params(parameter: string | string[] | Record<string, any>, value?: ParamValue | ParamValue[]): this {
    const addParam = (param: string | string[], values: ParamValue | ParamValue[]) => {
      values = forceArray(values)

      for (const val of values) {
        this._query.addParam(new ParamSpec(param, val))
      }
    }

    // Single parameter .params('foo', true)
    if (isString(parameter) || isArray(parameter)) {
      if (!isUnallowedValue(value)) {
        addParam(parameter, value ?? [])
      }
    }

    // Multiple parameters .params({ foo: true, bar: 'baz' })
    if (isPlainObject(parameter)) {
      for (const [param, val] of mapQuery(parameter)) {
        addParam(param, val)
      }
    }

    return this
  }

  /**
   * Specify the page that should be fetched.
   *
   * @param {number} page - The number of the page.
   */
  public page(page: number): this {
    assert(Number.isInteger(page), ['The `value` of `page` must be an integer.'])

    this._query.setPage(new PageSpec(page))

    return this
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public limit(limit: number): this {
    assert(Number.isInteger(limit), ['The `value` of `limit` must be an integer.'])

    this._query.setLimit(new LimitSpec(limit))

    return this
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public custom(...resources: (string | Model)[]): this {
    assert(resources.length !== 0, ['The `custom()` method takes a minimum of one argument.'])

    this._query.setResource(resources)

    return this
  }

  /**
   * Define the configuration of the request.
   *
   * @param {HttpClientOptions} config - The configuration of the request.
   */
  public config(config: Partial<HttpClientOptions>): this {
    this._requestHandler.setConfig(config)

    return this
  }
}
