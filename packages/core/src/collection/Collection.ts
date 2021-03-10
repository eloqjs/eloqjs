import { LiteralUnion } from 'type-fest'

import { Model, ModelReference } from '../model/Model'
import { Uid as UidGenerator } from '../support/Uid'
import {
  assert,
  isArray,
  isEmpty,
  isFunction,
  isModel,
  isNullish,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  ValueOf
} from '../support/Utils'
import { Element, Item } from '../types/Data'

export interface CollectionOptions {
  model?: typeof Model
}

export class Collection<M extends Model = Model> {
  protected static model: typeof Model

  public models: M[] = []

  /**
   * The unique ID for the collection.
   */
  public readonly $uid!: string

  private readonly _options: CollectionOptions

  private readonly _registry: Record<string, boolean> = {}

  public constructor(
    models: (M | Element)[] = [],
    options: CollectionOptions = {}
  ) {
    this._options = options

    this._boot()

    if (models) {
      this.add(models)
    }
  }

  /**
   * Accessor to support Array.length semantics.
   */
  public get length(): number {
    return this.count()
  }

  /**
   * Instantiate the given records.
   */
  private static _createModel<T extends Model>(
    records: (T | Element)[],
    modelType?: typeof Model
  ): T[]

  /**
   * Instantiate the given records.
   */
  private static _createModel<T extends Model>(
    record: T | Element,
    modelType?: typeof Model
  ): T

  /**
   * Instantiate the given records.
   */
  private static _createModel<T extends Model>(
    record: T | Element | (T | Element)[],
    modelType?: typeof Model
  ): T | T[] {
    if (isArray(record)) {
      return record.map((r) => this._createModel(r, modelType))
    }

    if (isModel(record)) {
      return record
    }

    const modelConstructor = modelType || this.model

    assert(!!modelConstructor, ['Model type is not defined.'])

    return new modelConstructor(record) as T
  }

  /**
   * Add a {@link Model} to this {@link Collection}.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all added models if an array was given.
   *
   * @param models Adds a model instance or plain object, or an array of either, to this collection.
   * A model instance will be created and returned if passed a plain object.
   *
   * @returns The added model or array of added models.
   */
  public add(models: (M | Element)[]): M[]

  /**
   * Add a {@link Model} to this {@link Collection}.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all added models if an array was given.
   *
   * @param model Adds a model instance or plain object, or an array of either, to this collection.
   * A model instance will be created and returned if passed a plain object.
   *
   * @returns The added model or array of added models.
   */
  public add(model: M | Element): M

  /**
   * Add a {@link Model} to this {@link Collection}.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all added models if an array was given.
   *
   * @param model Adds a model instance or plain object, or an array of either, to this collection.
   * A model instance will be created and returned if passed a plain object.
   *
   * @returns The added model or array of added models.
   */
  public add(model: M | Element | (M | Element)[]): M | M[] | void {
    // If given an array, assume an array of models and add them all.
    if (isArray(model)) {
      return model.map((m) => this.add(m)).filter((m): m is M => !!m)
    }

    // Objects should be converted to model instances first, then added.
    if (isPlainObject(model)) {
      return this.add(this._self()._createModel<M>(model, this._options.model))
    }

    // At this point, `model` should be an instance of Model.
    assert(isModel(model), [
      'Expected a model, plain object, or array of either.'
    ])

    // Make sure we don't add the same model twice.
    if (this._hasModelInRegistry(model)) {
      return
    }

    this.models.push(model)
    this.onAdd(model)

    return model
  }

  /**
   * Alias for the "avg" method.
   */
  public average(key: LiteralUnion<keyof ModelReference<M>, string>): number {
    return this.avg(key)
  }

  /**
   * Returns the average of a property of all models in the collection.
   */
  public avg(key: LiteralUnion<keyof ModelReference<M>, string>): number {
    return this.sum(key) / this.count()
  }

  /**
   * Creates a copy of this collection. Model references are preserved so
   * changes to the models inside the clone will also affect the subject.
   */
  public clone(): this {
    return new (this.constructor as typeof Collection)(
      this.models,
      this._options
    ) as this
  }

  /**
   * Returns the number of models in this collection.
   */
  public count(): number {
    return this.models.length
  }

  /**
   * Iterates through all models, calling a given callback for each one.
   */
  public each(
    callback: (model: M, index: number, array: M[]) => unknown
  ): boolean {
    return this.models.every((model, index) => {
      return callback(model, index, this.models) !== false
    })
    // return this.models.every(callback)
  }

  /**
   * Returns all models in the collection except the models with specified keys.
   */
  public except(keys: (string | number)[]): this {
    if (isNullish(keys) || isEmpty(keys)) {
      return this._createCollection(this.models)
    }

    const models = this.models.filter(
      (model) => model.$id && !keys.includes(model.$id)
    )

    return this._createCollection(models)
  }

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   */
  public find(key: string | number): Item<M>

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   */
  public find(keys: (string | number)[]): Item<M>[]

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   */
  public find(model: M): Item<M>

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   */
  public find<T = boolean>(predicate: (model: M) => T): Item<M>

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   */
  public find<T = boolean>(
    predicate: string | number | (string | number)[] | M | ((model: M) => T)
  ): Item<M> | Item<M>[] {
    if (isFunction(predicate)) {
      return this.models.find(predicate) || null
    }

    if (isModel(predicate)) {
      return (predicate.$id && this.find(predicate.$id)) || null
    }

    if (isArray(predicate)) {
      return predicate.map((id) => this.find(id)).filter((m): m is M => !!m)
    }

    assert(isString(predicate) || isNumber(predicate), [
      'Invalid type of `predicate` on `find`.'
    ])

    return this.find((model) => {
      return model.$id === predicate
    })
  }

  /**
   * Returns the first model of this collection.
   */
  public first(): Item<M> {
    if (this.isNotEmpty()) {
      return this.models[0]
    }

    return null
  }

  /**
   * Returns a new collection containing the models that would be present on a given page number.
   * The method accepts the page number as its first argument
   * and the number of items to show per page as its second argument.
   */
  public forPage(page: number, chunk: number): this {
    const models = this.models.slice(page * chunk - chunk, page * chunk)

    return this._createCollection(models)
  }

  /**
   * Determines whether this collection has the given model.
   *
   * @returns `true` if the collection contains the given model, `false` otherwise.
   */
  public has(model: M): boolean {
    return this._indexOf(model) >= 0
  }

  /**
   * Concatenate values of a given key as a string.
   *
   * @param key - The key of the attributes you wish to join.
   * @param glue - The "glue" string you wish to place between the values.
   */
  public implode(
    key: LiteralUnion<keyof ModelReference<M>, string>,
    glue: string
  ): string {
    return this.pluck(key).join(glue)
  }

  /**
   * Determines whether this collection is empty.
   *
   * @returns `true` if the collection is empty, `false` otherwise.
   */
  public isEmpty(): boolean {
    return !this.models.length
  }

  /**
   * Determines whether this collection is not empty.
   *
   * @returns `true` if the collection is not empty, `false` otherwise.
   */
  public isNotEmpty(): boolean {
    return !this.isEmpty()
  }

  /**
   * Returns the last model of this collection.
   */
  public last(): Item<M> {
    if (this.isNotEmpty()) {
      return this.models[this.count() - 1]
    }

    return null
  }

  /**
   * Returns an array that contains the returned result after applying a
   * function to each model in this collection.
   */
  public map<U = M>(callback: (model: M, index: number, array: M[]) => U): U[] {
    return this.models.map(callback)
  }

  /**
   * Returns only the models from the collection with the specified keys.
   */
  public only(keys: (string | number)[]): this {
    if (isNullish(keys) || isEmpty(keys)) {
      return this._createCollection(this.models)
    }

    const models = this.models.filter(
      (model) => model.$id && keys.includes(model.$id)
    )

    return this._createCollection(models)
  }

  /**
   * Returns an array that contains the values for a given key for each model in this collection.
   */
  public pluck<K extends keyof ModelReference<M>>(key: K): ValueOf<M, K>[]

  /**
   * Returns an array that contains the values for a given key for each model in this collection.
   */
  public pluck(key: string): unknown[]

  /**
   * Returns an array that contains the values for a given key for each model in this collection.
   */
  public pluck<K extends keyof ModelReference<M>>(
    key: K | string
  ): ValueOf<M, K>[] | unknown[] {
    return this.models.map((model) => model[key as K])
  }

  /**
   * Removes and returns the last model of this collection, if there was one.
   *
   * @returns {Model|undefined} Removed model or undefined if there were none.
   */
  public pop(): Item<M> {
    if (this.isNotEmpty()) {
      return this._removeModelAtIndex(this.count() - 1) || null
    }

    return null
  }

  /**
   * Reduces this collection to a value which is the accumulated result of
   * running each model through `iteratee`, where each successive invocation
   * is supplied the return value of the previous.
   *
   * If `initial` is not given, the first model of the collection is used
   * as the initial value.
   *
   * @param iteratee Invoked with three arguments: (result, model, index)
   *
   * @returns The final value of result, after the last iteration.
   */
  public reduce(
    iteratee: (result: M, model: M, index: number, array: M[]) => M
  ): M

  /**
   * Reduces this collection to a value which is the accumulated result of
   * running each model through `iteratee`, where each successive invocation
   * is supplied the return value of the previous.
   *
   * If `initial` is not given, the first model of the collection is used
   * as the initial value.
   *
   * @param iteratee Invoked with three arguments: (result, model, index)
   *
   * @param [initial] The initial value to use for the `result`.
   *
   * @returns The final value of result, after the last iteration.
   */
  public reduce(
    iteratee: (result: M, model: M, index: number, array: M[]) => M,
    initial: M
  ): M

  /**
   * Reduces this collection to a value which is the accumulated result of
   * running each model through `iteratee`, where each successive invocation
   * is supplied the return value of the previous.
   *
   * If `initial` is not given, the first model of the collection is used
   * as the initial value.
   *
   * @param iteratee Invoked with three arguments: (result, model, index)
   *
   * @param [initial] The initial value to use for the `result`.
   *
   * @returns The final value of result, after the last iteration.
   */
  public reduce<U = M>(
    iteratee: (result: U, model: M, index: number, array: M[]) => U,
    initial: U
  ): U

  /**
   * Reduces this collection to a value which is the accumulated result of
   * running each model through `iteratee`, where each successive invocation
   * is supplied the return value of the previous.
   *
   * If `initial` is not given, the first model of the collection is used
   * as the initial value.
   *
   * @param iteratee Invoked with three arguments: (result, model, index)
   *
   * @param [initial] The initial value to use for the `result`.
   *
   * @returns The final value of result, after the last iteration.
   */
  public reduce<U = M>(
    iteratee: (result: U | undefined, model: M, index: number, array: M[]) => U,
    initial?: U
  ): U | undefined {
    // Use the first model as the initial value if an initial was not given.
    if (arguments.length === 1) {
      initial = ((this.first() || undefined) as unknown) as U | undefined
    }

    return this.models.reduce(iteratee, initial)
  }

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param models Model to remove, which can be a model instance, an object to filter by, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @return The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(models: (M | Element)[]): M[] | undefined

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param predicate Model to remove, which can be a model instance, an object to filter by, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @return The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(
    predicate: (model: M, index: number, array: M[]) => boolean
  ): M[] | undefined

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param model Model to remove, which can be a model instance, an object to filter by, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @return The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(model: M | Element): M | undefined

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param model Model to remove, which can be a model instance, an object, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @return The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(
    model:
      | M
      | Element
      | (M | Element)[]
      | ((model: M, index: number, array: M[]) => boolean)
  ): M | M[] | undefined {
    // Support using a predicate to remove all models it returns true for.
    if (isFunction(model)) {
      return this.remove(this.models.filter(model))
    }

    if (isArray(model)) {
      return model.map((m) => this.remove(m)).filter((m): m is M => !!m)
    }

    // Objects should be converted to model instances first, then removed.
    if (isPlainObject(model)) {
      return this.remove(
        this._self()._createModel<M>(model, this._options.model)
      )
    }

    // At this point, `model` should be an instance of Model.
    assert(isModel(model), [
      'Expected function, object, array, or model to remove.'
    ])

    return this._removeModel(model)
  }

  /**
   * Replaces all models in this collection with those provided. This is
   * effectively equivalent to `clear` and `add`, and will result in an empty
   * collection if no models were provided.
   *
   * @param models Models to replace the current models with. Can be a model instance or plain object, or an array of
   * either. A model instance will be created and returned if passed a plain object.
   *
   * @returns The added model or array of added models.
   */
  public replace(models: (M | Element)[]): M[]

  /**
   * Replaces all models in this collection with those provided. This is
   * effectively equivalent to `clear` and `add`, and will result in an empty
   * collection if no models were provided.
   *
   * @param model Models to replace the current models with. Can be a model instance or plain object, or an array of
   * either. A model instance will be created and returned if passed a plain object.
   *
   * @returns The added model or array of added models.
   */
  public replace(model: M | Element): M

  /**
   * Replaces all models in this collection with those provided. This is
   * effectively equivalent to `clear` and `add`, and will result in an empty
   * collection if no models were provided.
   *
   * @param models Models to replace the current models with. Can be a model instance or plain object, or an array of
   * either. A model instance will be created and returned if passed a plain object.
   *
   * @returns The added model or array of added models.
   */
  public replace(models: M | Element | (M | Element)[]): M | M[] {
    assert(isObject(models) || isArray(models), [
      'Expected a model, plain object, or array of either.'
    ])

    this.clear()
    return this.add(models)
  }

  /**
   * Removes and returns the first model of this collection, if there was one.
   *
   * @returns Removed model or undefined if there were none.
   */
  public shift(): Item<M> {
    if (this.isNotEmpty()) {
      return this._removeModelAtIndex(0) || null
    }

    return null
  }

  /**
   * Returns the sum of a property of all models in the collection.
   *
   * @param {string|string[]|Function} key
   * @return {number}
   */
  public sum<K extends keyof ModelReference<M>>(
    key: K | string | ((model: M) => string | number)
  ): number {
    let total = 0

    for (const model of this.models) {
      let value: string | number

      if (isFunction(key)) {
        value = key(model)
      } else {
        value = (model[key as K] as unknown) as string | number
      }

      total += isString(value) ? parseFloat(value) : value
    }

    return parseFloat(total.toPrecision(12))
  }

  /**
   * @returns A native representation of this collection that will
   * determine the contents of JSON.stringify(collection).
   */
  public toJSON(): Model[] {
    return this.models
  }

  /**
   * Removes all models from this collection.
   */
  public clear(): void {
    this._clearModels()
  }

  /**
   * Called when a model has been removed from this collection.
   *
   * @param {Model} model
   */
  protected onRemove(model: Model): void {
    model.$unregisterCollection(this)
    this._removeModelFromRegistry(model)
  }

  /**
   * Called when a model has been added to this collection.
   *
   * @param {Model} model
   */
  protected onAdd(model: Model): void {
    model.$registerCollection(this)
    this._addModelToRegistry(model)
  }

  /**
   * Return the zero-based index of the given model in this collection.
   *
   * @return {number} the index of a model in this collection, or -1 if not found.
   */
  private _indexOf(model: Model): number {
    if (!this._hasModelInRegistry(model)) {
      return -1
    }

    return this.models.findIndex((m) => m.$uid === model.$uid)
  }

  /**
   * Remove a model from the model registry.
   *
   * @param {Model} model
   */
  private _removeModelFromRegistry(model: Model): void {
    this._registry[model.$uid] = false
  }

  /**
   * @return {Boolean} true if this collection has the model in its registry.
   */
  private _hasModelInRegistry(model: Model): boolean {
    return !!this._registry[model.$uid]
  }

  /**
   * Add a model from the model registry.
   *
   * @param {Model} model
   */
  private _addModelToRegistry(model: Model): void {
    this._registry[model.$uid] = true
  }

  /**
   * Remove a model at a given index.
   *
   * @param {number} index

   * @returns {Model} The model that was removed, or `undefined` if invalid.
   * @throws {Error} If a model could not be found at the given index.
   */
  private _removeModelAtIndex(index: number): M | undefined {
    if (index < 0) {
      return
    }

    const model: M = this.models[index]

    this.models.splice(index, 1)

    this.onRemove(model)

    return model
  }

  /**
   * Remove a {@link Model} from this collection.
   *
   * @param {Model} model
   *
   * @return {Model}
   */
  private _removeModel(model: M): M | undefined {
    return this._removeModelAtIndex(this._indexOf(model))
  }

  /**
   * Removes all models from this collection.
   */
  private _clearModels(): void {
    const models: Model[] = this.models

    // Clear the model store, but keep a reference.
    this.models = []

    // Notify each model that it has been removed from this collection.
    models.every((model) => {
      this.onRemove(model)
    })
  }

  /**
   * Creates a new instance of the collection.
   */
  private _createCollection(
    models: (M | Element)[] = [],
    options: CollectionOptions = {}
  ): this {
    return new (this.constructor as typeof Collection)(models, {
      ...this._options,
      ...options
    }) as this
  }

  /**
   * Get the constructor of this collection.
   */
  private _self(): typeof Collection {
    return this.constructor as typeof Collection
  }

  /**
   * Bootstrap this collection.
   */
  private _boot(): void {
    this._generateUid()
  }

  /**
   * Generate an unique ID for the collection.
   */
  private _generateUid(): void {
    // Define the $uid property.
    Object.defineProperty(this, '$uid', {
      value: UidGenerator.make('collection'),
      enumerable: false,
      configurable: true,
      writable: false
    })
  }
}
