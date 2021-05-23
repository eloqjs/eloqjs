import { Item, Model } from '@eloqjs/core'

import { Builder } from '../../builder/Builder'
import { Operation } from '../../operation/Operation'
import { DeletePromise } from '../../response/DeletePromise'
import { SavePromise } from '../../response/SavePromise'
import { assert, isEmpty, isNull } from '../../support/Utils'
import { ModelAPIStatic } from './ModelAPIStatic'

export class ModelAPIInstance<M extends Model = Model> {
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

  private static _operation<T extends Model>(model: T): Operation<T> {
    return new Operation(model)
  }

  /**
   * Get a {@link Builder} instance from {@link ModelAPIInstance}
   * so you can start querying.
   */
  public query(): Builder<M> {
    return new Builder(this.model.$self())
  }

  /**
   * Get a fresh instance of this {@link Model}.
   *
   * @return A {@link Promise} resolving to:
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
        .then((response) => response.data)
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

    assert(!isNull(selfId), [
      'Cannot attach a related model to a parent that has no ID.'
    ])

    const record = relationship.$serialize({
      isPayload: true
    })

    assert(!isEmpty(record), [
      'Cannot create a new record, because no data was provided.'
    ])

    return this._self()
      ._operation(relationship)
      .create({
        url: `${this.model.$resource}/${selfId}/${relationship.$resource}`
      })
  }

  /**
   * Delete a related record and detach it from this {@link Model}.
   */
  public detach<R extends Model>(relationship: R): DeletePromise {
    this._hasRelation(relationship)

    const selfId = this.model.$id

    assert(!isNull(selfId), [
      'Cannot detach a related model from a parent that has no ID.'
    ])

    const relationId = relationship.$id

    assert(!isNull(relationId), ['Cannot detach a related model with no ID.'])

    return this._self()
      ._operation(relationship)
      .delete({
        url: `${this.model.$resource}/${selfId}/${relationship.$resource}/${relationId}`
      })
  }

  /**
   * Update a related record and sync it to this {@link Model}.
   */
  public sync<R extends Model>(relationship: R): SavePromise<R> {
    this._hasRelation(relationship)

    const selfId = this.model.$id

    assert(!isNull(selfId), [
      'Cannot sync a related model to a parent that has no ID.'
    ])

    // Get ID before serialize, otherwise the ID may not be available.
    const relationId = relationship.$id

    assert(!isNull(relationId), ['Cannot sync a related model with no ID.'])

    return this._self()
      ._operation(relationship)
      .update({
        url: `${this.model.$resource}/${selfId}/${relationship.$resource}/${relationId}`
      })
  }

  /**
   * Create a related record for the provided {@link Model}.
   */
  public for<T extends Model>(model: T): SavePromise<M> {
    return model.$api().attach(this.model)
  }

  private _api(): ModelAPIStatic {
    return new ModelAPIStatic(this.model.$self())
  }

  private _hasRelation<R extends Model>(relationship: R): void {
    const modelName = this.model.$self().name
    const relationName = relationship.$self().name

    assert(this.model.$self().hasRelation(relationship.$self()), [
      `The ${modelName} model does not have a relationship with the ${relationName} model.`
    ])
  }

  private _self(): typeof ModelAPIInstance {
    return this.constructor as typeof ModelAPIInstance
  }
}
