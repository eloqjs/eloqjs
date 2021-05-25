import { Model } from '@eloqjs/core'

import { Request } from '../request/Request'
import { RequestMethod } from '../request/RequestMethod'
import { RequestOperation } from '../request/RequestOperation'
import { RequestOptions } from '../request/RequestOptions'
import { DeletePromise } from '../response/DeletePromise'
import { SavePromise } from '../response/SavePromise'
import { SaveResponse } from '../response/SaveResponse'
import { assert, isEmpty, isNull } from '../support/Utils'

export class Operation<M extends Model = Model> {
  protected model: M
  protected modelType: typeof Model
  protected requestHandler: Request

  public constructor(model: M) {
    this.model = model
    this.modelType = model.$self()
    this.requestHandler = new Request(this.modelType)
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public save(config?: Partial<RequestOptions>): SavePromise<M> {
    return this.modelType.hasId(this.model)
      ? this.update(config)
      : this.create(config)
  }

  /**
   * Create a record.
   */
  public create(config?: Partial<RequestOptions>): SavePromise<M> {
    const record = this.model.$serialize({ isPayload: true })

    assert(!isEmpty(record), [
      'Cannot create a new record, because no data was provided.'
    ])

    let saveResponse: SaveResponse<M>

    return this.requestHandler
      .request(
        {
          url: config?.url || this.modelType.getResource(),
          method: RequestMethod.POST,
          data: record
        },
        () => {
          this.modelType.executeMutationHooks('beforeSave', this.model)
          this.modelType.executeMutationHooks('beforeCreate', this.model)

          return new Promise((resolve) => {
            // Don't save if we're already busy saving this model.
            // This prevents things like accidental double-clicks.
            if (this.model.$saving) {
              resolve(RequestOperation.REQUEST_SKIP)
            }

            // TODO: Force save if `saveUnchanged` option is enabled.
            // Don't save if no data has changed, but consider it a success.
            if (this.model.$isClean()) {
              resolve(RequestOperation.REQUEST_REDUNDANT)
            }

            // Update saving state
            this.model.$saving = true

            resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          saveResponse = new SaveResponse(response, this.model)

          // We need to sync changes before references
          this.model.$syncChanges()
          this.model.$syncReference()

          // Automatically add to all registered collections.
          this.model.$addToAllCollections()

          // Update saving state
          this.model.$saving = false

          this.modelType.executeMutationHooks('afterCreateSuccess', this.model)
          this.modelType.executeMutationHooks('afterSaveSuccess', this.model)
        },
        () => {
          // Update saving state
          this.model.$saving = false

          this.modelType.executeMutationHooks('afterCreateFailure', this.model)
          this.modelType.executeMutationHooks('afterSaveFailure', this.model)
        },
        () => {
          this.modelType.executeMutationHooks('afterCreate', this.model)
          this.modelType.executeMutationHooks('afterSave', this.model)
        }
      )
      .then(() => saveResponse)
  }

  /**
   * Update a record.
   */
  public update(config?: Partial<RequestOptions>): SavePromise<M> {
    const id = this.model.$id

    assert(!isNull(id), ['Cannot update a model with no ID.'])

    const record = this.model.$serialize({ isPayload: true, isPatch: true })

    let saveResponse: SaveResponse<M>

    return this.requestHandler
      .request(
        {
          url: config?.url || this.modelType.getResource() + '/' + id,
          method: RequestMethod.PATCH,
          data: record
        },
        () => {
          this.modelType.executeMutationHooks('beforeUpdate', this.model)

          return new Promise((resolve) => {
            // Don't save if we're already busy saving this model.
            // This prevents things like accidental double-clicks.
            if (this.model.$saving) {
              resolve(RequestOperation.REQUEST_SKIP)
            }

            // TODO: Force save if `saveUnchanged` option is enabled.
            // Don't save if no data has changed, but consider it a success.
            if (this.model.$isClean()) {
              resolve(RequestOperation.REQUEST_REDUNDANT)
            }

            // Update saving state
            this.model.$saving = true

            resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          saveResponse = new SaveResponse(response, this.model)

          // We need to sync changes before references
          this.model.$syncChanges()
          this.model.$syncReference()

          // Automatically add to all registered collections.
          this.model.$addToAllCollections()

          // Update saving state
          this.model.$saving = false

          this.modelType.executeMutationHooks('afterUpdateSuccess', this.model)
          this.modelType.executeMutationHooks('afterSaveSuccess', this.model)
        },
        () => {
          // Update saving state
          this.model.$saving = false

          this.modelType.executeMutationHooks('afterUpdateFailure', this.model)
          this.modelType.executeMutationHooks('afterSaveFailure', this.model)
        },
        () => {
          this.modelType.executeMutationHooks('afterUpdate', this.model)
          this.modelType.executeMutationHooks('afterSave', this.model)
        }
      )
      .then(() => saveResponse)
  }

  /**
   * Delete a record.
   */
  public delete(config?: Partial<RequestOptions>): DeletePromise {
    // Get ID before serialize, otherwise the ID may not be available.
    const id = this.model.$id

    assert(!isNull(id), ['Cannot delete a model with no ID.'])

    return this.requestHandler.request(
      {
        url: config?.url || this.modelType.getResource() + '/' + id,
        method: RequestMethod.DELETE
      },
      () => {
        this.modelType.executeMutationHooks('beforeDelete', this.model)

        return new Promise((resolve) => {
          // Don't delete if we're already busy deleting this model.
          // This prevents things like accidental double-clicks.
          if (this.model.$deleting) {
            resolve(RequestOperation.REQUEST_SKIP)
          }

          // Update deleting state
          this.model.$deleting = true

          resolve(RequestOperation.REQUEST_CONTINUE)
        })
      },
      () => {
        // Automatically remove from all registered collections.
        this.model.$removeFromAllCollections()

        // Update deleting state
        this.model.$deleting = false

        this.modelType.executeMutationHooks('afterDeleteSuccess', this.model)
      },
      () => {
        // Update deleting state
        this.model.$deleting = false

        this.modelType.executeMutationHooks('afterDeleteFailure', this.model)
      },
      () => {
        this.modelType.executeMutationHooks('afterDelete', this.model)
      }
    )
  }
}
