import { Item, Model } from '@eloqjs/core'
import defu from 'defu'

import { Builder } from '../../builder/Builder'
import { HttpClientOptions } from '../../httpclient/HttpClientOptions'
import { Operation } from '../../operation/Operation'
import { DeletePromise } from '../../response/DeletePromise'
import { SavePromise } from '../../response/SavePromise'
import { assert, isEmpty, isUndefined } from '../../support/Utils'
import { ModelAPIStatic } from './ModelAPIStatic'

export class ModelAPIInstance<M extends Model = Model> {
  /**
   * The type of the model.
   */
  protected model: M

  /**
   * The request config.
   */
  private _config: Partial<HttpClientOptions> = {}

  /**
   * Create a new api instance.
   */
  public constructor(model: M) {
    this.model = model
  }

  /**
   * Get a {@link Builder} instance from {@link ModelAPIInstance}
   * so you can start querying.
   */
  public query(): Builder<M> {
    return new Builder(this.model.$constructor())
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
  public fresh(): Promise<Item<M>> {
    const id = this.model.$id

    if (id) {
      return this.query()
        .find(id)
        .then((response) => (response ? response.data : null))
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
          return Promise.resolve(null)
        })
    }

    return Promise.resolve(null)
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public save(): SavePromise<M> {
    return this._api().save(this.model) as SavePromise<M>
  }

  /**
   * Delete a record.
   */
  public delete(): DeletePromise {
    return this._api().delete(this.model)
  }

  /**
   * Create a related record and attach it to this {@link Model}.
   */
  public attach<R extends Model>(relationship: R): SavePromise<R> {
    this._hasRelation(relationship)

    const selfId = this.model.$id

    assert(!isUndefined(selfId), [
      'Cannot attach a related model to a parent that has no ID.'
    ])

    const record = relationship.$serialize({
      isRequest: true
    })

    assert(!isEmpty(record), [
      'Cannot create a new record, because no data was provided.'
    ])

    return this._operation(relationship).create(
      `${this.model.$resource}/${selfId}/${relationship.$resource}`
    )
  }

  /**
   * Delete a related record and detach it from this {@link Model}.
   */
  public detach<R extends Model>(relationship: R): DeletePromise {
    this._hasRelation(relationship)

    const selfId = this.model.$id

    assert(!isUndefined(selfId), [
      'Cannot detach a related model from a parent that has no ID.'
    ])

    const relationId = relationship.$id

    assert(!isUndefined(relationId), [
      'Cannot detach a related model with no ID.'
    ])

    return this._operation(relationship).delete(
      `${this.model.$resource}/${selfId}/${relationship.$resource}/${relationId}`
    )
  }

  /**
   * Update a related record and sync it to this {@link Model}.
   */
  public sync<R extends Model>(relationship: R): SavePromise<R> {
    this._hasRelation(relationship)

    const selfId = this.model.$id

    assert(!isUndefined(selfId), [
      'Cannot sync a related model to a parent that has no ID.'
    ])

    // Get ID before serialize, otherwise the ID may not be available.
    const relationId = relationship.$id

    assert(!isUndefined(relationId), [
      'Cannot sync a related model with no ID.'
    ])

    return this._operation(relationship).update(
      `${this.model.$resource}/${selfId}/${relationship.$resource}/${relationId}`
    )
  }

  /**
   * Create a related record for the provided {@link Model}.
   */
  public for<T extends Model>(model: T): SavePromise<M> {
    return model.$api().attach(this.model)
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

  private _operation<T extends Model>(model: T): Operation<T> {
    return new Operation(model).config(this._getConfig())
  }

  private _api(): ModelAPIStatic {
    return new ModelAPIStatic(this.model.$constructor()).config(
      this._getConfig()
    )
  }

  private _hasRelation<R extends Model>(relationship: R): void {
    const modelName = this.model.$constructor().name
    const relationName = relationship.$constructor().name

    assert(this.model.$constructor().hasRelation(relationship.$constructor()), [
      `The ${modelName} model does not have a relationship with the ${relationName} model.`
    ])
  }

  /**
   * Get the current request config.
   */
  private _getConfig() {
    return this._config
  }
}
