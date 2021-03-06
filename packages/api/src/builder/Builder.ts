import { Model } from '@eloqjs/core'

import { HttpClient } from '../httpclient/HttpClient'
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
import { PluralPromise } from '../response/PluralPromise'
import { PluralResponse } from '../response/PluralResponse'
import { SingularPromise } from '../response/SingularPromise'
import { SingularResponse } from '../response/SingularResponse'
import {
  assert,
  forceArray,
  isArray,
  isObject,
  isUndefined
} from '../support/Utils'
import { SortDirection } from './SortDirection'

export class Builder<M extends Model = Model, S extends boolean = false> {
  protected model: typeof Model

  private query: Query

  private readonly httpClient: HttpClient

  /**
   * If true, then this function will in all cases return a {@link SingularResponse}. This is used by HasOne relation,
   * which when queried spawn a Builder with this property set to true.
   */
  private readonly forceSingular: boolean

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

    this.query = new Query(resource, relatedResource, belongsToModelId)
    this.httpClient = model.getHttpClient()
    this.forceSingular = !!forceSingular

    assert(!!this.httpClient, ['You must define the HTTP Client'])
  }

  /**
   * Get a collection of records.
   */
  public get(): S extends true ? SingularPromise<M> : PluralPromise<M>
  public get(): SingularPromise<M> | PluralPromise<M> {
    if (this.forceSingular) {
      return this.httpClient
        .get(this.query.toString())
        .then((response) => new SingularResponse<M>(response, this.model))
    }

    return this.httpClient
      .get(this.query.toString())
      .then((response) => new PluralResponse<M>(response, this.model))
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): SingularPromise<M> {
    return this.httpClient
      .get(this.query.toString())
      .then((response) => new SingularResponse(response, this.model))
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): SingularPromise<M> {
    this.query.setIdToFind(id)

    return this.httpClient
      .get(this.query.toString())
      .then((response) => new SingularResponse(response, this.model))
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(attribute: string | string[], value: FilterValue): this {
    assert(!isUndefined(attribute) && !isUndefined(value), [
      'The `attribute` and `value` of `where` are required.'
    ])

    assert(!isArray(value) && !isObject(value), [
      'The `value` of `where` must be primitive.'
    ])

    this.query.addFilter(new FilterSpec(attribute, value))

    return this
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(attribute: string | string[], values: FilterValue[]): this {
    assert(!isUndefined(attribute) && !isUndefined(values), [
      'The `attribute` and `values` of `whereIn` are required.'
    ])

    assert(isArray(values), [
      'The `value` of `whereIn` must be an array of primitives.'
    ])

    for (const value of values) {
      this.query.addFilter(new FilterSpec(attribute, value))
    }

    return this
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): this {
    relationship = forceArray(relationship)

    for (const relation of relationship) {
      this.query.addInclude(new IncludeSpec(relation))
    }

    return this
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public append(attribute: string | string[]): this {
    attribute = forceArray(attribute)

    for (const attr of attribute) {
      this.query.addAppend(new AppendSpec(attr))
    }

    return this
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public select(field: string | string[]): this {
    assert(!isUndefined(field), ['The `field` of `select` is required.'])

    field = forceArray(field)

    for (const value of field) {
      this.query.addField(new FieldSpec(this.model.entity, value))
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

    this.query.addSort(
      new SortSpec(attribute, _direction === SortDirection.ASC)
    )

    return this
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {string} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public option(parameter: string, value: OptionValue | OptionValue[]): this {
    value = forceArray(value)

    for (const val of value) {
      this.query.addOption(new OptionSpec(parameter, val))
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

    this.query.setPage(new PageSpec(page))

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

    this.query.setLimit(new LimitSpec(limit))

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

    this.query.setResource(resources)

    return this
  }
}
