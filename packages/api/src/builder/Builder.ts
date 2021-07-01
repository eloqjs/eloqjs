import { Collection, Model } from '@eloqjs/core'

import { HttpClientOptions } from '../httpclient/HttpClientOptions'
import { Query } from '../query/Query'
import {
  AppendSpec,
  FieldSpec,
  IncludeSpec,
  LimitSpec,
  PageSpec,
  SortSpec
} from '../query/specs'
import { FilterSpec, FilterValue } from '../query/specs/FilterSpec'
import { OptionSpec, OptionValue } from '../query/specs/OptionSpec'
import { Request } from '../request/Request'
import { RequestMethod } from '../request/RequestMethod'
import { RequestOperation } from '../request/RequestOperation'
import { CollectionPromise } from '../response/CollectionPromise'
import { CollectionResponse } from '../response/CollectionResponse'
import { RecordPromise } from '../response/RecordPromise'
import { RecordResponse } from '../response/RecordResponse'
import {
  assert,
  forceArray,
  isArray,
  isObject,
  isPlainObject,
  isString,
  isUndefined
} from '../support/Utils'
import { mapFilterQuery } from './MapFilterQuery'
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

    const resource = belongsToModel
      ? belongsToModel.getResource()
      : model.getResource()
    const relatedResource = belongsToModel ? model.getResource() : undefined

    this._query = new Query(resource, relatedResource, belongsToModelId)
    this._requestHandler = new Request(this.model)
    this._forceSingular = !!forceSingular
  }

  /**
   * Get a collection of records.
   */
  public get<C extends Collection<M>>(
    collection?: C
  ): S extends true ? RecordPromise<M> : CollectionPromise<M, C>
  public get<C extends Collection<M>>(
    collection?: C
  ): RecordPromise<M> | CollectionPromise<M, C> {
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
          pluralResponse = new CollectionResponse(
            response,
            this.model,
            collection
          )
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
  public where(
    attribute: string | string[] | Record<string, any>,
    value?: FilterValue
  ): this

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(
    attribute: string | string[] | Record<string, any>,
    value?: FilterValue
  ): this {
    assert(!isUndefined(attribute), [
      'The `attribute` and `value` of `where` are required.'
    ])

    assert(!isArray(value) && !isObject(value), [
      'The `value` of `where` must be primitive.'
    ])

    if (isPlainObject(attribute)) {
      for (const [attr, val] of mapFilterQuery(attribute)) {
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
  public whereIn(
    attribute: string | string[] | Record<string, any>,
    values?: FilterValue[]
  ): this

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(
    attribute: string | string[] | Record<string, any>,
    values?: FilterValue[]
  ): this {
    assert(!isUndefined(attribute), [
      'The `attribute` and `values` of `whereIn` are required.'
    ])

    assert(isUndefined(values) || isArray(values), [
      'The `value` of `whereIn` must be an array of primitives.'
    ])

    if (isPlainObject(attribute)) {
      for (const [attr, val] of mapFilterQuery(attribute)) {
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
  public select(
    field: string | string[] | Record<string, string | string[]>
  ): this {
    assert(!isUndefined(field), ['The `field` of `select` is required.'])

    const addFields = (
      fields: string | string[],
      key: string = this.model.entity
    ): void => {
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
   * @param {string} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public orderBy(attribute: string, direction?: 'asc' | 'desc'): this {
    let _direction: typeof direction | SortDirection = direction

    switch (_direction) {
      default:
      case 'asc':
        _direction = SortDirection.ASC
        break
      case 'desc':
        _direction = SortDirection.DESC
    }

    this._query.addSort(
      new SortSpec(attribute, _direction === SortDirection.ASC)
    )

    return this
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {OptionValue | OptionValue[]} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public option(
    parameter: string | Record<string, OptionValue | OptionValue[]>,
    value?: OptionValue | OptionValue[]
  ): this {
    const addOption = (param: string, values: OptionValue | OptionValue[]) => {
      values = forceArray(values)

      for (const val of values) {
        this._query.addOption(new OptionSpec(param, val))
      }
    }

    // Single parameter .option('foo', true)
    if (isString(parameter)) {
      addOption(parameter, value || [])
    }

    // Multiple parameters .option({ foo: true, bar: 'baz' })
    if (isObject(parameter)) {
      for (const param in parameter) {
        addOption(param, parameter[param])
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
    assert(Number.isInteger(page), [
      'The `value` of `page` must be an integer.'
    ])

    this._query.setPage(new PageSpec(page))

    return this
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public limit(limit: number): this {
    assert(Number.isInteger(limit), [
      'The `value` of `limit` must be an integer.'
    ])

    this._query.setLimit(new LimitSpec(limit))

    return this
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public custom(...resources: (string | Model)[]): this {
    assert(resources.length !== 0, [
      'The `custom()` method takes a minimum of one argument.'
    ])

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
