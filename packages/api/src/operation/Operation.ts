import { Model } from '@eloqjs/core'

import { HttpClientOptions } from '../httpclient/HttpClientOptions'
import { Request } from '../request/Request'
import { RequestMethod } from '../request/RequestMethod'
import { RequestOperation } from '../request/RequestOperation'
import { DeletePromise } from '../response/DeletePromise'
import { SavePromise } from '../response/SavePromise'
import { SaveResponse } from '../response/SaveResponse'
import { assert, isEmpty, isNull } from '../support/Utils'

export class Operation<M extends Model = Model> {
  protected model: M
  protected modelType: typeof Model
  protected requestHandler: Request

  public constructor(model: M, config: Partial<HttpClientOptions> = {}) {
    this.model = model
    this.modelType = model.$self()
    this.requestHandler = new Request(this.modelType, config)
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public save(url?: string): SavePromise<M> {
    return this.modelType.hasId(this.model)
      ? this.update(url)
      : this.create(url)
  }

  /**
   * Create a record.
   */
  public create(url?: string): SavePromise<M> {
    const record = this.model.$serialize({ isRequest: true })

    assert(!isEmpty(record), [
      'Cannot create a new record, because no data was provided.'
    ])

    let saveResponse: SaveResponse<M>

    return this.requestHandler
      .request(
        {
          url: url || this.modelType.getResource(),
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

            // Don't save if no data has changed, but consider it a success.
            if (
              !this.model.$getOption('saveUnchanged') &&
              this.model.$isClean()
            ) {
              resolve(RequestOperation.REQUEST_REDUNDANT)
            }

            // Update saving state
            this.model.$saving = true

            resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          saveResponse = new SaveResponse(response, this.model)

          // Automatically add to all registered collections.
          this.model.$addToAllCollections()

          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = false

          this.modelType.executeMutationHooks('afterCreateSuccess', this.model)
          this.modelType.executeMutationHooks('afterSaveSuccess', this.model)
        },
        () => {
          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = true

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
  public update(url?: string): SavePromise<M> {
    const id = this.model.$id

    assert(!isNull(id), ['Cannot update a model with no ID.'])

    const record = this.model.$serialize({
      isRequest: true,
      shouldPatch: this.model.$shouldPatch()
    })

    let saveResponse: SaveResponse<M>

    return this.requestHandler
      .request(
        {
          url: url || this.modelType.getResource() + '/' + id,
          method: this.model.$shouldPatch()
            ? RequestMethod.PATCH
            : RequestMethod.PUT,
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

            // Don't save if no data has changed, but consider it a success.
            if (
              !this.model.$getOption('saveUnchanged') &&
              this.model.$isClean()
            ) {
              resolve(RequestOperation.REQUEST_REDUNDANT)
            }

            // Update saving state
            this.model.$saving = true

            resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          saveResponse = new SaveResponse(response, this.model)

          // Automatically add to all registered collections.
          this.model.$addToAllCollections()

          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = false

          this.modelType.executeMutationHooks('afterUpdateSuccess', this.model)
          this.modelType.executeMutationHooks('afterSaveSuccess', this.model)
        },
        () => {
          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = true

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
  public delete(url?: string): DeletePromise {
    // Get ID before serialize, otherwise the ID may not be available.
    const id = this.model.$id

    assert(!isNull(id), ['Cannot delete a model with no ID.'])

    return this.requestHandler.request(
      {
        url: url || this.modelType.getResource() + '/' + id,
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

        // Update deleting and fatal states
        this.model.$deleting = false
        this.model.$fatal = false

        this.modelType.executeMutationHooks('afterDeleteSuccess', this.model)
      },
      () => {
        // Update deleting and fatal states
        this.model.$deleting = false
        this.model.$fatal = true

        this.modelType.executeMutationHooks('afterDeleteFailure', this.model)
      },
      () => {
        this.modelType.executeMutationHooks('afterDelete', this.model)
      }
    )
  }

  /**
   * Define the configuration of the request.
   *
   * @param {HttpClientOptions} config - The configuration of the request.
   */
  public config(config: Partial<HttpClientOptions>): this {
    this.requestHandler.setConfig(config)

    return this
  }
}
