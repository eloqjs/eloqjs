import { Element, Item, Model as BaseModel } from '@eloqjs/core'

import { PluralPromise } from '../response/PluralPromise'
import { SingularPromise } from '../response/SingularPromise'

export class Model extends BaseModel {
  /**
   * Get a collection of records.
   */
  public static all<M extends typeof Model>(
    this: M
  ): PluralPromise<InstanceType<M>> {
    return this.api().all()
  }

  /**
   * Get the first record of a collection of records.
   */
  public static first<M extends typeof Model>(
    this: M
  ): SingularPromise<InstanceType<M>> {
    return this.api().first()
  }

  /**
   * Find an specific record.
   */
  public static find<M extends typeof Model>(
    this: M,
    id: string | number
  ): SingularPromise<InstanceType<M>> {
    return this.api().find(id)
  }

  /**
   * Save or update a record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public static save<M extends typeof Model>(
    this: M,
    record: InstanceType<M> | Element
  ): SingularPromise<InstanceType<M>> {
    return this.api().save(record)
  }

  /**
   * Delete a record.
   */
  public static delete(id: string | number): Promise<void> {
    return this.api().delete(id)
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
  public $fresh(): Promise<Item<this>> {
    return this.$api().fresh()
  }

  /**
   * Save or update the record.
   * If the record doesn't have an ID, a new record will be created, otherwise the record will be updated.
   */
  public $save(): SingularPromise<this> {
    return this.$api().save()
  }

  /**
   * Delete the record.
   */
  public $delete(): Promise<void> {
    return this.$api().delete()
  }
}
