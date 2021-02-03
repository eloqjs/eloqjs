import { Model, Relations } from '@eloqjs/core'

import { FilterValue } from '../query/specs/FilterSpec'
import { OptionValue } from '../query/specs/OptionSpec'
import { SingularPromise } from '../response/SingularPromise'
import { HasOneAPI } from './api'

export class HasOne<M extends Model = Model> extends Relations.HasOne<M> {
  /**
   * Get a collection of records.
   */
  public get(): SingularPromise<M> {
    return this.api().get()
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): SingularPromise<M> {
    return this.api().first()
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): SingularPromise<M> {
    return this.api().find(id)
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(attribute: string | string[], value: FilterValue): HasOneAPI<M> {
    return this.api().where(attribute, value)
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
  ): HasOneAPI<M> {
    return this.api().whereIn(attribute, values)
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): HasOneAPI<M> {
    return this.api().with(relationship)
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public append(attribute: string | string[]): HasOneAPI<M> {
    return this.api().append(attribute)
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public select(field: string | string[]): HasOneAPI<M> {
    return this.api().select(field)
  }

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {string} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public orderBy(attribute: string, direction?: 'asc' | 'desc'): HasOneAPI<M> {
    return this.api().orderBy(attribute, direction)
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
  ): HasOneAPI<M> {
    return this.api().option(parameter, value)
  }

  /**
   * Specify the page that should be fetched.
   *
   * @param {number} page - The number of the page.
   */
  public page(page: number): HasOneAPI<M> {
    return this.api().page(page)
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public limit(limit: number): HasOneAPI<M> {
    return this.api().limit(limit)
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public custom(...resources: (string | Model)[]): HasOneAPI<M> {
    return this.api().custom(...resources)
  }
}
