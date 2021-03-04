import { Model } from '../model/Model'
import { Uid as UidGenerator } from '../support/Uid'
import { assert, forceArray, isFunction } from '../support/Utils'
import { Element } from '../types/Data'

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
    assert(model && typeof model === 'object', [
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
    assert(model && (typeof model === 'object' || isFunction(model)), [
      'Expected function, object, array, or model to remove.'
    ])

    // Support using a predicate to remove all models it returns true for.
    if (isFunction(model)) {
      return this.remove(this.models.filter(model))
    }

    if (Array.isArray(model)) {
      return model.filter((m) => !!this.remove(m))
    }

    // Instantiate the object
    const _model = this._self()._instantiate<M>(model, this._options.model)

    return this._removeModel(_model)
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
