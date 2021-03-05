import { Model, ModelReference } from '../model/Model'
import { Uid as UidGenerator } from '../support/Uid'
import {
  assert,
  forceArray,
  isArray,
  isFunction,
  isNumber,
  isObject,
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
   * Instantiate the given records.
   */
  private static _instantiate<T extends Model>(
    records: (T | Element)[],
    modelType?: typeof Model
  ): T[]

  /**
   * Instantiate the given records.
   */
  private static _instantiate<T extends Model>(
    record: T | Element,
    modelType?: typeof Model
  ): T

  /**
   * Instantiate the given records.
   */
  private static _instantiate<T extends Model>(
    record: T | Element | (T | Element)[],
    modelType?: typeof Model
  ): T | T[] {
    if (Array.isArray(record)) {
      return record.map((r) => this._instantiate(r, modelType))
    }

    if (record instanceof Model) {
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
  public add(model: M | Element | (M | Element)[]): M | M[] {
    assert(isObject(model) || isArray(model), [
      'Expected a model, plain object, or array of either.'
    ])

    // Instantiate the object
    const _model = this._self()._instantiate<M>(model, this._options.model)
    const models: M[] = forceArray(_model)

    for (const model of models) {
      this.models.push(model)
      this.onAdd(model)
    }

    return _model
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
    predicate: string | number | M | ((model: M) => T)
  ): Item<M> {
    assert(
      isString(predicate) ||
        isNumber(predicate) ||
        (typeof predicate === 'object' && predicate instanceof Model) ||
        isFunction(predicate),
      ['Invalid type of `predicate` on `find`.']
    )

    if (isFunction(predicate)) {
      return this.models.find(predicate) || null
    }

    if (typeof predicate === 'object') {
      return (predicate.$id && this.find(predicate.$id)) || null
    }

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
   * Determines whether this collection has the given model.
   *
   * @returns `true` if the collection contains the given model, `false` otherwise.
   */
  public has(model: M): boolean {
    return this._indexOf(model) >= 0
  }

  /**
   * Determines whether this collection is empty.
   *
   * @returns `true` if the collection is empty, `false` otherwise.
   */
  public isEmpty(): boolean {
    return !this.size()
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
      return this.models[this.size() - 1]
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
      return this._removeModelAtIndex(this.size() - 1) || null
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
      initial = (this.first() || undefined) as U | undefined
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
    assert(isObject(model) || isArray(model) || isFunction(model), [
      'Expected function, object, array, or model to remove.'
    ])

    // Support using a predicate to remove all models it returns true for.
    if (isFunction(model)) {
      return this.remove(this.models.filter(model))
    }

    if (isArray(model)) {
      return model.map((m) => this.remove(m)).filter((m): m is M => !!m)
    }

    // Instantiate the object
    const _model = this._self()._instantiate<M>(model, this._options.model)

    return this._removeModel(_model)
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
   * Returns the number of models in this collection.
   */
  public size(): number {
    return this.models.length
  }

  /**
   * @returns A native representation of this collection that will
   * determine the contents of JSON.stringify(collection).
   */
  public toJSON(): Model[] {
    return this.models
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
