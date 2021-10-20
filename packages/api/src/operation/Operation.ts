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
    this.modelType = model.$constructor()
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
          const beforeSave = this.model.$emit('beforeSave')
          const beforeCreate = this.model.$emit('beforeCreate')

          return new Promise((resolve) => {
            // Don't save if we're already busy saving this model.
            // This prevents things like accidental double-clicks.
            // Also don't save if some hook return false.
            if (
              this.model.$saving ||
              beforeSave === false ||
              beforeCreate === false
            ) {
              return resolve(RequestOperation.REQUEST_SKIP)
            }

            // Don't save if no data has changed, but consider it a success.
            if (
              !this.model.$getOption('saveUnchanged') &&
              this.model.$isClean()
            ) {
              return resolve(RequestOperation.REQUEST_REDUNDANT)
            }

            // Update saving state
            this.model.$saving = true

            return resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          saveResponse = new SaveResponse(response, this.model)

          // Automatically add to all registered collections.
          this.model.$addToAllCollections()

          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = false

          this.model.$emit('afterCreateSuccess')
          this.model.$emit('afterSaveSuccess')
        },
        () => {
          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = true

          this.model.$emit('afterCreateFailure')
          this.model.$emit('afterSaveFailure')
        },
        () => {
          this.model.$emit('afterCreate')
          this.model.$emit('afterSave')
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
          const beforeSave = this.model.$emit('beforeSave')
          const beforeUpdate = this.model.$emit('beforeUpdate')

          return new Promise((resolve) => {
            // Don't save if we're already busy saving this model.
            // This prevents things like accidental double-clicks.
            // Also don't save if some hook return false.
            if (
              this.model.$saving ||
              beforeSave === false ||
              beforeUpdate === false
            ) {
              return resolve(RequestOperation.REQUEST_SKIP)
            }

            // Don't save if no data has changed, but consider it a success.
            if (
              !this.model.$getOption('saveUnchanged') &&
              this.model.$isClean()
            ) {
              return resolve(RequestOperation.REQUEST_REDUNDANT)
            }

            // Update saving state
            this.model.$saving = true

            return resolve(RequestOperation.REQUEST_CONTINUE)
          })
        },
        (response) => {
          saveResponse = new SaveResponse(response, this.model)

          // Automatically add to all registered collections.
          this.model.$addToAllCollections()

          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = false

          this.model.$emit('afterUpdateSuccess')
          this.model.$emit('afterSaveSuccess')
        },
        () => {
          // Update saving and fatal states
          this.model.$saving = false
          this.model.$fatal = true

          this.model.$emit('afterUpdateFailure')
          this.model.$emit('afterSaveFailure')
        },
        () => {
          this.model.$emit('afterUpdate')
          this.model.$emit('afterSave')
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
        const beforeDelete = this.model.$emit('beforeDelete')

        return new Promise((resolve) => {
          // Don't delete if we're already busy deleting this model.
          // This prevents things like accidental double-clicks.
          // Also don't delete if some hook return false.
          if (this.model.$deleting || beforeDelete === false) {
            return resolve(RequestOperation.REQUEST_SKIP)
          }

          // Update deleting state
          this.model.$deleting = true

          return resolve(RequestOperation.REQUEST_CONTINUE)
        })
      },
      () => {
        // Automatically remove from all registered collections.
        this.model.$removeFromAllCollections()

        // Update deleting and fatal states
        this.model.$deleting = false
        this.model.$fatal = false

        this.model.$emit('afterDeleteSuccess')
      },
      () => {
        // Update deleting and fatal states
        this.model.$deleting = false
        this.model.$fatal = true

        this.model.$emit('afterDeleteFailure')
      },
      () => {
        this.model.$emit('afterDelete')
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
