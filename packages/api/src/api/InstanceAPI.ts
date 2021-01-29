import { Item, Model } from '@eloqjs/core'

import { Builder } from '../builder/Builder'
import { SingularPromise } from '../response/SingularPromise'
import { API } from './API'

export class InstanceAPI<M extends Model = Model> {
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

  /**
   * Get a {@link Builder} instance from {@link InstanceAPI}
   * so you can start querying.
   */
  public query(): Builder<M> {
    return new Builder(this.model.constructor as typeof Model)
  }

  /**
   * Get a fresh instance of this {@link Model}.
   *
   * @return A {@link Promise} resolving to:
   *
   * * the representation of this {@link Model} instance in the API if this {@link Model} has an ID and this ID can.
   * be found in the API too
   * * `null` if this {@link Model} instance has no ID or if there _is_ an ID, but a {@link Model} with this ID cannot be found in the backend.
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
  public save(): SingularPromise<M> {
    return this._api().save(this.model) as SingularPromise<M>
  }

  /**
   * Delete a record.
   */
  public delete(): Promise<void> {
    const id = this.model.$id

    if (id === null) {
      throw new Error('Cannot delete a model with no ID.')
    }

    return this._api().delete(id)
  }

  private _api(): API {
    return new API(this.model.constructor as typeof Model)
  }
}
