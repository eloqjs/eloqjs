import { Element, Item, Model as BaseModel } from '@eloqjs/core'

import * as Attributes from '../attributes'
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
   * Create a has one relationship.
   */
  protected static hasOne(related: typeof Model): Attributes.HasOne {
    return new Attributes.HasOne(this, related)
  }

  /**
   * Create a has many relationship.
   */
  protected static hasMany(related: typeof Model): Attributes.HasMany {
    return new Attributes.HasMany(this, related)
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

  /**
   * Create a related record and attach it to this {@link Model}.
   */
  public $attach<R extends Model>(relationship: R): SingularPromise<R> {
    return this.$api().attach(relationship)
  }

  /**
   * Delete a related record and detach it from this {@link Model}.
   */
  public $detach<R extends Model>(relationship: R): Promise<void> {
    return this.$api().detach(relationship)
  }

  /**
   * Update a related record and sync it to this {@link Model}.
   */
  public $sync<R extends Model>(relationship: R): SingularPromise<R> {
    return this.$api().sync(relationship)
  }

  /**
   * Create a related record for the provided {@link Model}.
   */
  public $for<T extends Model>(model: T): SingularPromise<this> {
    return this.$api().for(model)
  }
}
