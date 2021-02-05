import { Collection, Element, Item, Model } from '@eloqjs/core'

import { Builder } from '../../builder/Builder'
import { FilterValue } from '../../query/specs/FilterSpec'
import { OptionValue } from '../../query/specs/OptionSpec'
import { PluralPromise } from '../../response/PluralPromise'
import { Response } from '../../response/Response'
import { SingularPromise } from '../../response/SingularPromise'

export class RelationAPI<
  M extends Model = Model,
  D extends Item<M> | Collection<M> = Item<M> | Collection<M>,
  S extends boolean = boolean
> {
  public data: D

  protected model: typeof Model

  protected belongsToModel: Model

  protected key: string

  protected forceSingular: S

  /**
   * Get a {@link Builder} instance from {@link RelationAPI}
   * so you can start querying.
   */
  protected query: Builder<M, boolean>

  public constructor(
    model: typeof Model,
    belongsToModel: Model,
    data: D,
    key: string,
    forceSingular: S
  ) {
    this.model = model
    this.belongsToModel = belongsToModel
    this.data = data
    this.key = key
    this.forceSingular = forceSingular

    this.query = new Builder<M, boolean>(
      this.model,
      this.belongsToModel.$self(),
      this.belongsToModel.$id ?? undefined,
      forceSingular
    )
  }

  /**
   * Get a collection of records.
   */
  public get(): S extends true ? SingularPromise<M> : PluralPromise<M>

  /**
   * Get a collection of records.
   */
  public get(): Promise<Response> {
    const response = this.query.get()

    this.updateRelation(response, this.forceSingular)

    return response
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): SingularPromise<M> {
    const response = this.query.first()

    this.updateRelation(response, true)

    return response
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): SingularPromise<M> {
    const response = this.query.find(id)

    this.updateRelation(response, true)

    return response
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(attribute: string | string[], value: FilterValue): this {
    this.query.where(attribute, value)

    return this
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(attribute: string | string[], values: FilterValue[]): this {
    this.query.whereIn(attribute, values)

    return this
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): this {
    this.query.with(relationship)

    return this
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public append(attribute: string | string[]): this {
    this.query.append(attribute)

    return this
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public select(field: string | string[]): this {
    this.query.select(field)

    return this
  }

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {string} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public orderBy(attribute: string, direction?: 'asc' | 'desc'): this {
    this.query.orderBy(attribute, direction)

    return this
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {string} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public option(parameter: string, value: OptionValue | OptionValue[]): this {
    this.query.option(parameter, value)

    return this
  }

  /**
   * Specify the page that should be fetched.
   *
   * @param {number} page - The number of the page.
   */
  public page(page: number): this {
    this.query.page(page)

    return this
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public limit(limit: number): this {
    this.query.limit(limit)

    return this
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public custom(...resources: (string | Model)[]): this {
    this.query.custom(...resources)

    return this
  }

  /**
   * Create a record of this relation and attach it to the parent {@link Model}.
   */
  public attach(record: M | Element): SingularPromise<M> {
    let relationship = record as M

    if (!(record instanceof Model)) {
      relationship = new this.model(record) as M
    }

    return this.belongsToModel.$api().attach(relationship)
  }

  /**
   * Delete a record of this relation and detach it from the parent {@link Model}.
   */
  public detach(id: string | number): Promise<void> {
    const relationship = new this.model({ [this.model.primaryKey]: id }) as M
    return this.belongsToModel.$api().detach(relationship)
  }

  /**
   * Update a record of this relation and sync it to the parent {@link Model}.
   */
  public sync(record: M | Element): SingularPromise<M> {
    let relationship = record as M

    if (!(record instanceof Model)) {
      relationship = new this.model(record) as M
    }

    return this.belongsToModel.$api().sync(relationship)
  }

  private updateRelation(
    response: Promise<Response>,
    isSingular: boolean
  ): void {
    response.then((response) => {
      const isArray = Array.isArray(this.belongsToModel[this.key])
      this.belongsToModel[this.key] =
        isArray && isSingular
          ? [...this.belongsToModel[this.key].data, response.data]
          : response.data
    })
  }
}
