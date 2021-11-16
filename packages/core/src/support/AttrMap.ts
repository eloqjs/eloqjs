import { Relation } from '../relations'
import { Map } from './Map'
import {
  clone,
  forceArray,
  isArray,
  isCollection,
  isEmpty,
  isEqual,
  isModel,
  isPlainObject,
  isString
} from './Utils'

export class AttrMap<T> extends Map<T> {
  protected reference: Record<string, T> = {}
  protected changes: Record<string, T> = {}

  public set(key: string, value: T): void {
    this._setReference(key, value)
    super.set(key, value)
  }

  public $get(key: string): T {
    return this.reference[key]
  }

  public $toArray(): Record<string, T> {
    return this.reference
  }

  /**
   * Sync the reference attributes with the current.
   */
  public syncReference(attributes?: string | string[]): void {
    if (!attributes) {
      this.reference = { ...this.data }
      return
    }

    attributes = forceArray(attributes).filter((attribute) =>
      Object.keys(this.data).includes(attribute)
    )

    for (const attribute of attributes) {
      this.reference[attribute] = this.data[attribute]
    }
  }

  /**
   * Sync the changed attributes.
   */
  public syncChanges(): void {
    this.changes = this.getDirty()
  }

  /**
   * Resets attributes back to their reference values (source of truth).
   */
  public reset(attributes?: string | string[]): void {
    if (!attributes) {
      this.data = { ...this.reference }
      return
    }

    attributes = forceArray(attributes).filter((attribute) =>
      Object.keys(this.data).includes(attribute)
    )

    for (const attribute of attributes) {
      this.data[attribute] = this.reference[attribute]
    }
  }

  /**
   * Determine if any of the given attribute(s) have been modified.
   */
  public isDirty(attributes?: string | string[]): boolean {
    return this.hasChanges(this.getDirty(), forceArray(attributes || []))
  }

  /**
   * Determine if all the given attribute(s) have remained the same.
   */
  public isClean(attributes?: string | string[]): boolean {
    return !this.isDirty(attributes)
  }

  /**
   * Determine if any of the given attribute(s) have been modified.
   */
  public wasChanged(attributes?: string | string[]): boolean {
    return this.hasChanges(this.getChanges(), forceArray(attributes || []))
  }

  /**
   * Get the attributes that have been changed since the last sync.
   */
  public getDirty(): Record<string, T> {
    const dirty: Record<string, T> = {}

    for (const key in this.data) {
      const reference = this.$get(key)
      const value = this.get(key)
      const isDirty =
        value instanceof Relation
          ? this._isRelationDirty(value)
          : !isEqual(value, reference)

      if (isDirty) {
        dirty[key] = this.get(key)
      }
    }

    return dirty
  }

  /**
   * Get the attributes that were changed.
   *
   * @returns array
   */
  public getChanges(): Record<string, T> {
    return this.changes
  }

  /**
   * Determine if any of the given attributes were changed.
   */
  protected hasChanges(
    changes: Record<string, T>,
    attributes: string[] = []
  ): boolean {
    attributes = attributes.filter((attribute) =>
      Object.keys(this.data).includes(attribute)
    )

    // If no specific attributes were provided, we will just see if the dirty array
    // already contains any attributes. If it does we will just return that this
    // count is greater than zero. Else, we need to check specific attributes.
    if (isEmpty(attributes)) {
      return Object.keys(changes).length > 0
    }

    // Here we will spin through every attribute and see if this is in the array of
    // dirty attributes. If it is, we will return true and if we make it through
    // all of the attributes for the entire array we will return false at end.
    for (const attribute of attributes) {
      if (attribute in changes) {
        return true
      }
    }

    return false
  }

  private _setReference(key: string, value: T): void {
    if (!(key in this.reference)) {
      if (isArray(value) || isPlainObject(value)) {
        this.reference[key] = clone(value, (_key, value) => {
          const dateRegex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/

          // Revive date objects
          if (isString(value) && dateRegex.test(value)) {
            return new Date(value)
          }

          return value
        })
      } else {
        this.reference[key] = value
      }
    }
  }

  private _isRelationDirty(relation: Relation) {
    if (isCollection(relation.data)) {
      return relation.data.models.some((model) => model.$getDirty())
    }

    if (isModel(relation.data)) {
      return relation.data.$isDirty()
    }

    return false
  }
}
