import { Collection, Element, Item, Model, Relations } from '@eloqjs/core'

import { FilterValue } from '../query/specs/FilterSpec'
import { ParamValue } from '../query/specs/ParamSpec'
import { CollectionPromise } from '../response/CollectionPromise'
import { DeletePromise } from '../response/DeletePromise'
import { RecordPromise } from '../response/RecordPromise'
import { SavePromise } from '../response/SavePromise'
import { RelationAPI } from './api'

export class Relation<
  M extends Model = Model,
  D extends Item<M> | Collection<M> = Item<M> | Collection<M>,
  S extends boolean = boolean
> extends Relations.Relation<M, D, S> {
  /**
   * Get a collection of records.
   */
  public get(): S extends true ? RecordPromise<M> : CollectionPromise<M>

  /**
   * Get a collection of records.
   */
  public get(): RecordPromise<M> | CollectionPromise<M> {
    return this.api().get()
  }

  /**
   * Get the first record of a collection of records.
   */
  public first(): RecordPromise<M> {
    return this.api().first()
  }

  /**
   * Find an specific record.
   */
  public find(id: string | number): RecordPromise<M> {
    return this.api().find(id)
  }

  /**
   * Add a basic "where" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} value - The value the attribute should be equal.
   */
  public where(attribute: string | string[], value: FilterValue): RelationAPI<M, D, S> {
    return this.api().where(attribute, value)
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string | string[]} attribute - The attribute being tested.
   * @param {string} values - The values the attribute should be equal.
   */
  public whereIn(attribute: string | string[], values: FilterValue[]): RelationAPI<M, D, S> {
    return this.api().whereIn(attribute, values)
  }

  /**
   * Specify a relation that should be eager loaded in the returned object graph.
   * @param {string | string[]} relationship - The relationship that should be eager loaded.
   */
  public with(relationship: string | string[]): RelationAPI<M, D, S> {
    return this.api().with(relationship)
  }

  /**
   * Specify an attribute that should be eager loaded in the returned object graph.
   *
   * @param {string | string[]} attribute - The attribute that should be eager loaded.
   */
  public append(attribute: string | string[]): RelationAPI<M, D, S> {
    return this.api().append(attribute)
  }

  /**
   * Specify the fields that should be included in the returned object graph.
   */
  public select(field: string | string[]): RelationAPI<M, D, S> {
    return this.api().select(field)
  }

  /**
   * Specify an attribute to sort by and the direction to sort in.
   *
   * @param {string} attribute - The attribute to sort by.
   * @param {string} [direction] - The direction to sort in.
   */
  public orderBy(attribute: string, direction?: 'asc' | 'desc'): RelationAPI<M, D, S> {
    return this.api().orderBy(attribute, direction)
  }

  /**
   * Specify a custom query parameter to add to the resulting HTTP request URL.
   *
   * @param {string} parameter - The name of the parameter, e.g. 'bar' in "http://foo.com?bar=baz"
   * @param {string} value - The value of the parameter, e.g. 'baz' in "http://foo.com?bar=baz"
   */
  public option(parameter: string, value: ParamValue | ParamValue[]): RelationAPI<M, D, S> {
    return this.api().option(parameter, value)
  }

  /**
   * Specify the page that should be fetched.
   *
   * @param {number} page - The number of the page.
   */
  public page(page: number): RelationAPI<M, D, S> {
    return this.api().page(page)
  }

  /**
   * Specify the limit of records that should be fetched.
   *
   * @param {number} limit - The limit of records.
   */
  public limit(limit: number): RelationAPI<M, D, S> {
    return this.api().limit(limit)
  }

  /**
   * Build a custom endpoint for the resulting HTTP request URL.
   *
   * @param {...(string|Model)} resources - The resources to be built into a custom endpoint.
   */
  public custom(...resources: (string | Model)[]): RelationAPI<M, D, S> {
    return this.api().custom(...resources)
  }

  /**
   * Create a record of this relation and attach it to the parent {@link Model}.
   */
  public attach(record: M | Element): SavePromise<M> {
    return this.api().attach(record)
  }

  /**
   * Delete a record of this relation and detach it from the parent {@link Model}.
   */
  public detach(id: string | number): DeletePromise {
    return this.api().detach(id)
  }

  /**
   * Update a record of this relation and sync it to the parent {@link Model}.
   */
  public sync(record: M | Element): SavePromise<M> {
    return this.api().sync(record)
  }
}
