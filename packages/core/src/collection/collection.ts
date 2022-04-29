import { Uid as UidGenerator } from '../helpers/uid'
import { ID, Model, ModelOptions, ModelReference } from '../model'
import { Element, Item } from '../types'
import { assert, forceArray, resolveValue, variadic } from '../utils'
import {
  isArray,
  isCollection,
  isEmpty,
  isFunction,
  isModel,
  isNull,
  isNullish,
  isNumber,
  isPlainObject,
  isSerializedCollection,
  isString,
  isUndefined
} from '../utils/is'
import { ValueOf, Variadic } from '../utils/types'
import { CloneCollectionOptions, CollectionOptions, SerializeCollectionOptions, SerializedCollection } from './types'
import { sortGreaterOrLessThan, sortNullish } from './utils/sort'
import { compareValues, Operator } from './utils/where'

export class Collection<M extends Model = Model> {
  protected static model: typeof Model

  public models: M[] = []

  /**
   * The unique ID for the collection.
   */
  public readonly $uid!: string

  private readonly _options: CollectionOptions = {}

  private readonly _registry: Record<string, boolean> = {}

  public constructor(models: (M | Element)[] | SerializedCollection = [], options: CollectionOptions = {}) {
    this._boot(options)

    if (isSerializedCollection(models)) {
      this.deserialize(models)

      // Override options from deserialized data
      this.setOptions(options)
    } else if (models) {
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
   * Determines whether the given value is the instance of {@link Collection}.
   *
   * @param value The value to be checked.
   */
  public static isCollection<T extends Model = Model>(value: unknown): value is Collection<T> {
    return isCollection(value)
  }

  /**
   * Instantiate the given records.
   */
  private static _createModel<T extends Model>(records: (T | Element)[], modelType?: typeof Model): T[]

  /**
   * Instantiate the given records.
   */
  private static _createModel<T extends Model>(record: T | Element, modelType?: typeof Model): T

  /**
   * Instantiate the given records.
   */
  private static _createModel<T extends Model>(record: T | Element | (T | Element)[], modelType?: typeof Model): T | T[] {
    if (isArray(record)) {
      return record.map((r) => this._createModel(r, modelType))
    }

    if (isModel(record)) {
      return record
    }

    const modelConstructor = modelType || this.model

    assert(!!modelConstructor, ['Model type is not defined.'])

    return new (modelConstructor as any)(record) as T
  }

  public [Symbol.iterator](): Iterator<M> {
    let index = -1

    return {
      next: () => {
        index += 1

        return {
          value: this.models[index],
          done: index >= this.models.length
        }
      }
    }
  }

  /**
   * Get a collection's option.
   */
  public getOption<K extends keyof CollectionOptions>(key: K): ValueOf<CollectionOptions, K>
  public getOption<K extends keyof CollectionOptions, F>(key: K, fallback: F): NonNullable<ValueOf<CollectionOptions, K>> | F
  public getOption(key: string, fallback?: unknown): any {
    return this._options[key] ?? fallback
  }

  /**
   * Get the collection options.
   */
  public getOptions(): CollectionOptions {
    return this._options
  }

  /**
   * Set a collection's option.
   */
  public setOption<K extends keyof CollectionOptions>(key: K, value: ValueOf<CollectionOptions, K>) {
    this._options[key] = value
  }

  /**
   * Set the collection options.
   */
  public setOptions(options: CollectionOptions) {
    options = {
      ...this._options,
      ...options
    }

    for (const key in options) {
      this.setOption(key as keyof CollectionOptions, options[key])
    }
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
  public add(models: (M | Element)[] | Collection): M[]

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

  public add(model: M | Element | (M | Element)[] | Collection): M | M[] {
    // If given an array, assume an array of models and add them all.
    if (isCollection(model) || isArray(model)) {
      return model.map((m) => this.add(m)).filter((m): m is M => !!m)
    }

    // Objects should be converted to model instances first, then added.
    if (isPlainObject(model)) {
      return this.add(this._constructor()._createModel<M>(model, this._options.model))
    }

    // At this point, `model` should be an instance of Model.
    assert(isModel(model), ['Expected a model, plain object, or array of either.'])

    // Make sure we don't add the same model twice.
    if (this._hasModelInRegistry(model)) {
      return model
    }

    this.models.push(model)
    this.onAdd(model)

    return model
  }

  /**
   * Takes an integer value and returns the model at that index,
   * allowing for positive and negative integers.
   * Negative integers count back from the last model in the collection.
   */
  public at(index: number): M | undefined {
    return this.models.at(index)
  }

  /**
   * Returns the average of a property of all models in the collection.
   *
   * Alias for the [avg() method]{@link Collection.avg}.
   */
  public average(key: keyof ModelReference<M> | string): number {
    return this.avg(key)
  }

  /**
   * Returns the average of a property of all models in the collection.
   */
  public avg(key: keyof ModelReference<M> | string): number {
    return this.sum(key) / this.count()
  }

  /**
   * Breaks the collection into multiple, smaller collections of a given size.
   *
   * @param size - Size of the chunks.
   */
  public chunk(size: number): this[] {
    const chunks = []
    let index = 0

    do {
      const models = this.models.slice(index, index + size)
      const collection = this._createCollection(models)

      chunks.push(collection)
      index += size
    } while (index < this.count())

    return chunks
  }

  /**
   * Creates a copy of this collection. Model references are preserved by default so
   * changes to the models inside the clone will also affect the subject.
   *
   * If the `deep` option is enabled, all models of this collection will be cloned as well.
   * Model references will be lost.
   *
   * If `deepLevel` is set to `2`, models relationships will be cloned as well.
   */
  public clone(options: CloneCollectionOptions = {}): this {
    options = {
      deep: false,
      deepLevel: 1,
      ...options
    }

    let models = this.models

    if (options.deep) {
      models = this.models.map((model) => model.$clone({ deep: (options.deepLevel as 1 | 2) >= 2 }))
    }

    return this._createCollection(models)
  }

  /**
   * Combines two or more arrays.
   *
   * This method returns a new collections without modifying any existing collections.
   *
   * @param collections Additional collections and/or models to add to the end of the collection.
   */
  public concat(...collections: Variadic<M | M[] | Collection<M>>): this {
    const models = variadic(collections).map((collectionOrModel) =>
      isCollection(collectionOrModel) ? collectionOrModel.models : collectionOrModel
    )

    return this._createCollection(this.models.concat(...models))
  }

  /**
   * Determines whether this collection contains the given model.
   *
   * Alias for the [includes() method]{@link Collection.includes}.
   *
   * @returns `true` if the collection contains the given model, `false` otherwise.
   */
  public contains(id: NonNullable<ID> | M | (NonNullable<ID> | M)[]): boolean

  /**
   * Determines whether this collection contains the given model.
   *
   * Alias for the [includes() method]{@link Collection.includes}.
   *
   * @returns `true` if the collection contains the given model, `false` otherwise.
   */
  public contains<V>(key: keyof ModelReference<M> | string, value: V): boolean

  public contains(key: any, value?: unknown): boolean {
    return this.includes(key, value)
  }

  /**
   * Returns the number of models in this collection.
   */
  public count(): number {
    return this.models.length
  }

  /**
   * Counts the occurrences of values in this collection.
   */
  public countBy(callback: (model: M, index: number) => string): Record<string, number> {
    const group = this.groupBy(callback)

    return Object.keys(group).reduce((result, key) => {
      result[key] = group[key].length
      return result
    }, {} as Record<string, number>)
  }

  /**
   * Deserialize given data.
   */
  public deserialize(serializedCollection: SerializedCollection): this {
    assert(!!serializedCollection, ['No data to deserialize'])

    this.setOptions(serializedCollection.options)
    this.replace(serializedCollection.models)

    return this
  }

  /**
   * Performs the specified action for each model in the collection.
   *
   * Alias for the [forEach() method]{@link Collection.forEach}.
   *
   * @param callback A function that accepts up to three arguments. forEach calls the callback function one time for
   *   each model in the collection.
   */
  public each(callback: (model: M, index: number, array: M[]) => void): this {
    return this.forEach(callback)
  }

  /**
   * Determines whether all the models of the collection satisfy the specified test.
   *
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each model in the collection until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the collection.
   */
  public every(predicate: (value: M, index: number, array: M[]) => unknown): boolean {
    return this.models.every(predicate)
  }

  /**
   * Returns all models in the collection except the models with specified keys.
   */
  public except(keys: (string | number)[]): this {
    if (isNullish(keys) || isEmpty(keys)) {
      return this._createCollection(this.models)
    }

    const models = this.models.filter((model) => model.$id && !keys.includes(model.$id))

    return this._createCollection(models)
  }

  /**
   * Fill a {@link Model} of this {@link Collection} by the model's ID.
   *
   * If an ID is not provided, a new model will be added to this collection.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all updated models if an array was given.
   *
   * @param records A model instance or plain object, or an array of either, to be filled in this collection.
   * A model instance will be created and returned if passed a plain object.
   * @param options
   *
   * @returns The filled model or array of filled models.
   */
  public fill(records: (M | Element)[], options?: ModelOptions): M[]

  /**
   * Fill a {@link Model} of this {@link Collection} by the model's ID.
   *
   * If an ID is not provided, a new model will be added to this collection.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all filled models if an array was given.
   *
   * @param record A model instance or plain object, or an array of either, to be filled in this collection.
   * A model instance will be created and returned if passed a plain object.
   * @param options
   *
   * @returns The filled model or array of filled models.
   */
  public fill(record: M | Element, options?: ModelOptions): M

  public fill(record: M | Element | (M | Element)[], options: ModelOptions = {}): M | M[] {
    // If given an array, assume an array of models and add them all.
    if (isArray(record)) {
      return record.map((m) => this.fill(m, options)).filter((m): m is M => !!m)
    }

    // Get the ID from model or record
    const id = Model.getIdFromRecord(record)

    // If we don't have an ID, we can't compare the model, so just add the model to the collection
    if (isUndefined(id)) {
      return this.add(record)
    }

    // Retrieve a model from this collection based on the given ID
    const model = this.find(id)

    // If we couldn't retrieve a model from this collection, then add the model to this collection
    if (isNull(model)) {
      return this.add(record)
    }

    // At this point, `model` should be an instance of Model.
    assert(isModel(model), ['Expected a model, plain object, or array of either.'])

    // Fill the model found in the collection by the given attributes.
    model.$fill(record)

    return model
  }

  /**
   * Returns the collection using the given callback,
   * keeping only those models that pass a given truth test.
   *
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one
   *   time for each element in the array.
   */
  public filter(predicate: (model: M, index: number, array: M[]) => unknown): this {
    return this._createCollection(this.models.filter(predicate))
  }

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   * If `predicate` is an array of keys, find will return all models which match the keys.
   */
  public find(id: NonNullable<ID>): Item<M>

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
   * primary key.
   * If `predicate` is an array of keys, find will return all models which match the keys.
   */
  public find(ids: NonNullable<ID>[]): Item<M>[]

  /**
   * Returns the first model that matches the given criteria.
   * If `predicate` is a `string` or `number`, `find` will attempt to return a model matching the
   * primary key.
   * If `predicate` is an array of keys, find will return all models which match the keys.
   */
  public find<T = boolean>(predicate: (model: M) => T): Item<M>

  public find<T = boolean>(predicate: NonNullable<ID> | NonNullable<ID>[] | ((model: M) => T)): Item<M> | Item<M>[] {
    if (isFunction(predicate)) {
      return this.models.find(predicate) || null
    }

    if (isArray(predicate)) {
      return predicate.map((id) => this.find(id)).filter((m): m is M => !!m)
    }

    assert(isString(predicate) || isNumber(predicate), ['Invalid type of `predicate` on `find`.'])

    return this.find((model) => {
      return model.$id === predicate
    })
  }

  /**
   * Returns the index of the first model in the collection where predicate is true, and -1
   * otherwise.
   *
   * @param id The ID of the model or a {@link Model} instance.
   */
  public findIndex(id: NonNullable<ID> | M): number

  /**
   * Returns the index of the first model in the collection where predicate is true, and -1
   * otherwise.
   *
   * @param predicate find calls predicate once for each model of the collection, in ascending
   * order, until it finds one where predicate returns true. If such a model is found,
   * findIndex immediately returns that model index. Otherwise, findIndex returns -1.
   */
  public findIndex(predicate: (model: M, index: number, array: M[]) => unknown): number

  public findIndex(predicate: NonNullable<ID> | M | ((model: M, index: number, array: M[]) => unknown)): number {
    if (isFunction(predicate)) {
      return this.models.findIndex(predicate)
    }

    if (isModel(predicate)) {
      return this.findIndex((model) => {
        return model.$uid === predicate.$uid
      })
    }

    assert(isString(predicate) || isNumber(predicate), ['Invalid type of `predicate` on `findIndex`.'])

    return this.findIndex((model) => {
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
   * Performs the specified action for each model in the collection.
   *
   * @param callback A function that accepts up to three arguments. forEach calls the callback function one time for
   *   each model in the collection.
   */
  public forEach(callback: (model: M, index: number, array: M[]) => void): this {
    this.models.forEach(callback)

    return this
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
   * Groups the models in this collection by a given key.
   */
  public groupBy(key: keyof ModelReference<M> | string | ((model: M, index: number) => string)): Record<string, this> {
    const collection: Record<string, this> = {}

    this.models.forEach((model, index) => {
      let resolvedKey: string

      if (isFunction(key)) {
        resolvedKey = key(model, index) ?? ''
      } else {
        resolvedKey = model[key as string] ?? ''
      }

      if (isUndefined(collection[resolvedKey])) {
        collection[resolvedKey] = this._createCollection()
      }

      collection[resolvedKey].add(model)
    })

    return collection
  }

  /**
   * Concatenate values of a given key as a string.
   *
   * @param key - The key of the attributes you wish to join.
   * @param glue - The "glue" string you wish to place between the values.
   */
  public implode(key: keyof ModelReference<M> | string, glue: string): string {
    return this.pluck(key).join(glue)
  }

  /**
   * Determines whether this collection contains the given model.
   *
   * @returns `true` if the collection contains the given model, `false` otherwise.
   */
  public includes(id: NonNullable<ID> | M | (NonNullable<ID> | M)[]): boolean

  /**
   * Determines whether this collection contains the given model.
   *
   * @returns `true` if the collection contains the given model, `false` otherwise.
   */
  public includes<V>(key: keyof ModelReference<M> | string, value: V): boolean

  public includes(key: string | M | NonNullable<ID> | (NonNullable<ID> | M)[], value?: unknown): boolean {
    if (isArray(key)) {
      return key.every((model) => this.contains(model))
    }

    let callback: (model: M, index: number, array: M[]) => boolean

    if (isModel(key)) {
      callback = (model) => model.$uid === key.$uid
    } else if (value) {
      callback = (model) => model[key as string] === value
    } else {
      callback = (model) => model.$id === key
    }

    return this.models.some(callback)
  }

  /**
   * Returns the index of the first model in the collection where predicate is true, and -1
   * otherwise.
   *
   * Alias for the [findIndex() method]{@link Collection.findIndex}.
   *
   * @param id The ID of the model or a {@link Model} instance.
   */

  /**
   * Returns the index of the first model in the collection where predicate is true, and -1
   *
   * Alias for the [findIndex() method]{@link Collection.findIndex}.
   *
   * @param predicate find calls predicate once for each model of the collection, in ascending
   * order, until it finds one where predicate returns true. If such a model is found,
   * findIndex immediately returns that model index. Otherwise, findIndex returns -1.
   */
  public indexOf(predicate: (model: M, index: number, array: M[]) => unknown): number

  public indexOf(id: any): number {
    return this.findIndex(id)
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
   * Returns the maximum value of a given key.
   */
  public max(key: keyof ModelReference<M> | string): number {
    const values = this.pluck(key).filter((value) => value !== undefined) as number[]

    return Math.max(...values)
  }

  /**
   * Returns the [median value]{@link https://en.wikipedia.org/wiki/Median} of a given key.
   */
  public median(key: keyof ModelReference<M> | string): number {
    if (this.count() % 2 === 0) {
      return (
        ((this.models[this.count() / 2 - 1][key as string] as number) +
          (this.models[this.count() / 2][key as string] as number)) /
        2
      )
    }

    return this.models[Math.floor(this.count() / 2)][key as string] as number
  }

  /**
   * Returns the minimum value of a given key.
   */
  public min(key: keyof ModelReference<M> | string): number {
    const values = this.pluck(key).filter((value) => value !== undefined) as number[]

    return Math.min(...values)
  }

  /**
   * Returns the [mode value]{@link https://en.wikipedia.org/wiki/Mode_(statistics)} of a given key.
   */
  public mode(key: keyof ModelReference<M> | string): number[] | null {
    const values: { key: number; count: number }[] = []
    let highestCount = 1

    if (this.isEmpty()) {
      return null
    }

    this.models.forEach((model) => {
      const tempValues = values.filter((value) => {
        return value.key === model[key as string]
      })

      if (!tempValues.length) {
        values.push({
          key: model[key as string],
          count: 1
        })
      } else {
        tempValues[0].count += 1
        const { count } = tempValues[0]

        if (count > highestCount) {
          highestCount = count
        }
      }
    })

    return values.filter((value) => value.count === highestCount).map((value) => value.key)
  }

  /**
   * Returns an array of primary keys.
   */
  public modelKeys(): ID[] {
    return this.models.map((model) => model.$id)
  }

  /**
   * Creates a new collection consisting of every n-th model.
   */
  public nth(step: number, offset?: number): this {
    const models = this.models.slice(offset).filter((_model, index) => index % step === 0)

    return this._createCollection(models)
  }

  /**
   * Returns only the models from the collection with the specified keys.
   */
  public only(keys: (string | number)[]): this {
    if (isNullish(keys) || isEmpty(keys)) {
      return this._createCollection(this.models)
    }

    const models = this.models.filter((model) => model.$id && keys.includes(model.$id))

    return this._createCollection(models)
  }

  /**
   * May be combined with destructuring to separate models
   * that pass a given truth test from those that do not.
   */
  public partition(callback: (model: M) => boolean): [this, this] {
    const arrays: [this, this] = [this._createCollection(), this._createCollection()]

    this.models.forEach((model) => {
      if (callback(model)) {
        arrays[0].add(model)
      } else {
        arrays[1].add(model)
      }
    })

    return arrays
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
  public pluck<K extends keyof ModelReference<M>>(key: K | string): ValueOf<M, K>[] | unknown[]

  public pluck<K extends keyof ModelReference<M>>(key: K | string): ValueOf<M, K>[] | unknown[] {
    return this.models.map((model) => model[key as K])
  }

  /**
   * Removes and returns the last model of this collection, if there was one.
   *
   * @returns Removed model or null if there were none.
   */
  public pop(): Item<M> {
    if (this.isNotEmpty()) {
      return this._removeModelAtIndex(this.count() - 1) || null
    }

    return null
  }

  public random(): Item<M>

  public random(length: number): this

  /**
   * Returns a random model from the collection.
   */
  public random(length?: number): Item<M> | this {
    const collection = this.clone().shuffle()

    // If not a length was specified
    if (!length) {
      return collection.first()
    }

    return collection.take(length)
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
  public reduce(iteratee: (result: M, model: M, index: number, array: M[]) => M): M

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
  public reduce(iteratee: (result: M, model: M, index: number, array: M[]) => M, initial: M): M

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
  public reduce<U = M>(iteratee: (result: U, model: M, index: number, array: M[]) => U, initial: U): U

  public reduce<U = M>(iteratee: (result: U | undefined, model: M, index: number, array: M[]) => U, initial?: U): U | undefined {
    // Use the first model as the initial value if an initial was not given.
    if (arguments.length === 1) {
      initial = (this.first() || undefined) as unknown as U | undefined
    }

    return this.models.reduce(iteratee, initial)
  }

  /**
   * Returns the collection using the given callback.
   * The callback should return true if the item should be removed from the resulting collection.
   *
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one
   *   time for each element in the array.
   */
  public reject(predicate: (model: M, index: number, array: M[]) => unknown): this {
    return this._createCollection(this.models.filter((model, index, array) => !predicate(model, index, array)))
  }

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param models Model to remove, which can be a model instance, an object to filter by, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @returns The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(models: (M | Element)[] | Collection): M[] | undefined

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param predicate Model to remove, which can be a model instance, an object to filter by, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @returns The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(predicate: (model: M, index: number, array: M[]) => unknown): M[] | undefined

  /**
   * Remove the given {@link Model} from this {@link Collection}.
   *
   * @param model Model to remove, which can be a model instance, an object to filter by, a function to filter by,
   * or an array of model instances and objects to remove multiple.
   *
   * @returns The deleted model or an array of models if a filter or array type was given.
   *
   * @throws {Error} If the model is an invalid type.
   */
  public remove(model: M | Element): M | undefined

  public remove(model: M | Element | (M | Element)[] | ((model: M, index: number, array: M[]) => unknown)): M | M[] | undefined {
    // Support using a predicate to remove all models it returns true for.
    if (isFunction(model)) {
      return this.remove(this.models.filter(model))
    }

    if (isCollection(model) || isArray(model)) {
      return model.map((m) => this.remove(m)).filter((m): m is M => !!m)
    }

    // Objects should be used to find the model first, then removed.
    if (isPlainObject(model)) {
      const m = this.models.find((m) => m.$id === m.$constructor().getIdFromRecord(model))
      return m ? this.remove(m) : undefined
    }

    // At this point, `model` should be an instance of Model.
    assert(isModel(model), ['Expected function, object, array, or model to remove.'])

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
  public replace(models: (M | Element)[] | Collection<M>): M[]

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

  public replace(models: M | Element | (M | Element)[] | Collection<M>): M | M[] {
    this.clear()
    return this.add(models)
  }

  /**
   * Resets all models in this collection. This method delegates to each model
   * so follows the same signature and effects as {@link Model.$reset}.
   */
  public reset(attributes?: string | string[]): void {
    for (const model of this.models) {
      model.$reset(attributes)
    }
  }

  /**
   * Reverses the order of the collection's models.
   */
  public reverse(): this {
    return this._createCollection(([] as M[]).concat(this.models).reverse())
  }

  /**
   * Serialize given collection POJO.
   */
  public serialize(options: SerializeCollectionOptions = {}): SerializedCollection {
    options = {
      relations: true,
      ...options
    }

    return {
      options: this._options,
      models: this.map((model) =>
        model.$serialize({
          relations: options.relations
        })
      )
    }
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
   * Randomly shuffles the models in this collection.
   */
  public shuffle(): this {
    let j
    let x
    let i

    for (i = this.count(); i; i -= 1) {
      j = Math.floor(Math.random() * i)
      x = this.models[i - 1]
      this.models[i - 1] = this.models[j]
      this.models[j] = x
    }

    return this
  }

  /**
   * Returns a new collection, without the first given amount of models.
   */
  public skip(count: number): this {
    return this._createCollection(this.models.slice(count))
  }

  /**
   * Skips models until the given callback returns true and
   * then returns the remaining items in the collection.
   * You may also pass a simple value to the skipUntil method to skip all items until the given value is found.
   */
  public skipUntil(model: M): this

  /**
   * Skips models until the given callback returns true and
   * then returns the remaining items in the collection.
   * You may also pass a simple value to the skipUntil method to skip all items until the given value is found.
   */
  public skipUntil(predicate: (model: M, index: number, array: M[]) => unknown): this

  public skipUntil(value: M | ((model: M, index: number, array: M[]) => unknown)): this {
    let previous: boolean | null = null
    const callback = isFunction(value) ? value : (model: M) => model.$id === value.$id

    return this.filter((model, index, array) => {
      if (previous !== true) {
        previous = !!callback(model, index, array)
      }

      return previous
    })
  }

  /**
   * Skips models while the given callback returns true and
   * then returns the remaining models in the collection
   */
  public skipWhile(predicate: (model: M, index: number, array: M[]) => unknown): this {
    let previous: boolean | null = null

    return this.filter((model, index, array) => {
      if (previous !== true) {
        previous = !predicate(model, index, array)
      }

      return previous
    })
  }

  /**
   * Determines whether the specified callback function returns true for any model of the collection.
   *
   * @param predicate A function that accepts up to three arguments. The some method calls
   * the predicate function for each model in the collection until the predicate returns a value
   * which is coercible to the Boolean value true, or until the end of the collection.
   */
  public some(predicate: (value: M, index: number, array: M[]) => unknown): boolean {
    return this.models.some(predicate)
  }

  /**
   * Sorts the collection [in place]{@link https://en.wikipedia.org/wiki/In-place_algorithm}.
   *
   * This method mutates the collection and returns a reference to the same collection.
   *
   * @param compare Function used to determine the order of the models. It is expected to return
   * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
   * value otherwise.
   */
  public sort(compare: (a: M, b: M) => number): this {
    this.models.sort(compare)

    return this
  }

  /**
   * Sorts the collection [in place]{@link https://en.wikipedia.org/wiki/In-place_algorithm} using a comparator.
   *
   * This method mutates the collection and returns a reference to the same collection.
   */
  public sortBy(comparator: keyof ModelReference<M> | string | ((model: M) => string | number)): this {
    this.models.sort((a, b) => {
      const valueA = resolveValue(a, comparator as string | ((model: M) => string | number))
      const valueB = resolveValue(b, comparator as string | ((model: M) => string | number))

      return sortNullish(valueA, valueB) || sortGreaterOrLessThan(valueA, valueB)
    })

    return this
  }

  /**
   * Sorts the collection [in place]{@link https://en.wikipedia.org/wiki/In-place_algorithm} using a comparator, but in
   * the opposite order.
   */
  public sortByDesc(comparator: keyof ModelReference<M> | string | ((model: M) => string | number)): this {
    this.sortBy(comparator)

    this.models.reverse()

    return this
  }

  /**
   * Removes models from a collection and, if necessary, inserts new models in their place, returning the deleted
   * models.
   *
   * @param start The zero-based location in the collection from which to start removing models.
   * @param deleteCount The number of models to remove.
   *
   * @returns A collection containing the models that were deleted.
   */
  public splice(start: number, deleteCount?: number): M[]

  /**
   * Removes models from a collection and, if necessary, inserts new models in their place, returning the deleted
   * models.
   *
   * @param start The zero-based location in the collection from which to start removing models.
   * @param deleteCount The number of models to remove.
   * @param models Models to insert into the collection in place of the deleted models.
   *
   * @returns A collection containing the models that were deleted.
   */
  public splice(start: number, deleteCount: number, models: M | M[]): M[]

  public splice(start: number, deleteCount?: any, models: M | M[] = []): M[] {
    return this.models.splice(start, deleteCount, ...forceArray(models))
  }

  /**
   * Breaks a collection into the given number of groups.
   */
  public split(size: number): this[] {
    const modelsPerGroup = Math.round(this.count() / size)
    const collections = []

    for (let iterator = 0; iterator < size; iterator += 1) {
      collections.push(this._createCollection(this.models.splice(0, modelsPerGroup)))
    }

    return collections
  }

  /**
   * Returns the sum of a property of all models in the collection.
   */
  public sum(key: keyof ModelReference<M> | string | ((model: M) => string | number)): number {
    let total = 0

    for (const model of this.models) {
      let value: string | number

      if (isFunction(key)) {
        value = key(model)
      } else {
        value = model[key as string] as unknown as string | number
      }

      total += (isString(value) ? parseFloat(value) : value) || 0
    }

    return parseFloat(total.toPrecision(12))
  }

  /**
   * Syncs the reference of all models in this collection. This method delegates to each model
   * so follows the same signature and effects as {@link Model.$syncReference}.
   */
  public syncReference(attributes?: string | string[]): void {
    for (const model of this.models) {
      model.$syncReference(attributes)
    }
  }

  /**
   * Returns a new collection with the specified number of models.
   *
   * You may also pass a negative integer to take the specified amount of models from the end of the collection.
   */
  public take(limit: number): this {
    if (limit < 0) {
      return this._createCollection(this.models.slice(limit))
    }

    return this._createCollection(this.models.slice(0, limit))
  }

  /**
   * Returns models in the collection until the given callback returns true.
   * You may also pass a models to the `takeUntil` method to get the models until the given model is found.
   */
  public takeUntil(model: M): this

  /**
   * Returns models in the collection until the given callback returns true.
   * You may also pass a models to the `takeUntil` method to get the models until the given model is found.
   */
  public takeUntil(callback: (model: M, index: number, array: M[]) => unknown): this

  public takeUntil(value: M | ((model: M, index: number, array: M[]) => unknown)): this {
    let previous: boolean | null = null
    const callback = isFunction(value) ? value : (model: M) => model.$id === value.$id

    return this.filter((model, index, array) => {
      if (previous !== false) {
        previous = !callback(model, index, array)
      }

      return previous
    })
  }

  /**
   * Returns models in the collection until the given callback returns false.
   */
  public takeWhile(predicate: (model: M, index: number, array: M[]) => unknown): this {
    let previous: boolean | null = null

    return this.filter((model, index, array) => {
      if (previous !== false) {
        previous = !!predicate(model, index, array)
      }

      return previous
    })
  }

  /**
   * Returns an array of the models within this collection.
   */
  public toArray(): M[] {
    return this.models
  }

  /**
   * @returns A native representation of this collection that will
   * determine the contents of JSON.stringify(collection).
   */
  public toJSON(): SerializedCollection {
    return this.serialize()
  }

  /**
   * Inserts new models at the start of the collection, and returns the new length of the collection.
   *
   * @param models Models to insert at the start of the collection.
   */
  public unshift(models: M | M[]): number {
    return this.models.unshift(...forceArray(models))
  }

  /**
   * Update a {@link Model} of this {@link Collection} by the model's ID.
   *
   * If an ID is not provided, a new model will be added to this collection.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all updated models if an array was given.
   *
   * @param records A model instance or plain object, or an array of either, to be updated in this collection.
   * A model instance will be created and returned if passed a plain object.
   *
   * @returns The updated model or array of updated models.
   */
  public update(records: (M | Element)[]): M[]

  /**
   * Update a {@link Model} of this {@link Collection} by the model's ID.
   *
   * If an ID is not provided, a new model will be added to this collection.
   *
   * This method returns a single model if only one was given, but will return
   * an array of all updated models if an array was given.
   *
   * @param record A model instance or plain object, or an array of either, to be updated in this collection.
   * A model instance will be created and returned if passed a plain object.
   *
   * @returns The updated model or array of updated models.
   */
  public update(record: M | Element): M

  public update(record: M | Element | (M | Element)[]): M | M[] {
    // If given an array, assume an array of models and add them all.
    if (isArray(record)) {
      return record.map((m) => this.update(m)).filter((m): m is M => !!m)
    }

    // Get the ID from model or record
    const id = Model.getIdFromRecord(record)

    // If we don't have an ID, we can't compare the model, so just add the model to the collection
    if (isUndefined(id)) {
      return this.add(record)
    }

    // Retrieve a model from this collection based on the given ID
    const model = this.find(id)

    // If we couldn't retrieve a model from this collection, then add the model to this collection
    if (isNull(model)) {
      return this.add(record)
    }

    // At this point, `model` should be an instance of Model.
    assert(isModel(model), ['Expected a model, plain object, or array of either.'])

    // Update the model found in the collection by the given attributes.
    model.$update(record)

    return model
  }

  /**
   * Filters the collection by a given key / value pair.
   */
  public where<V = unknown>(key: keyof ModelReference<M> | string, value?: V): this

  /**
   * Filters the collection by a given key / value pair.
   */
  public where<V = unknown>(key: keyof ModelReference<M> | string, operator: Operator, value: V): this

  /**
   * Filters the collection by a given key / value pair.
   */
  public where<V>(key: keyof ModelReference<M> | string, operator?: V | Operator, value?: V): this

  public where<V>(key: keyof ModelReference<M> | string, operator?: V | Operator, value?: V): this {
    const collection = this.clone()

    let comparisonOperator = operator
    let comparisonValue = value

    if (operator === undefined || (operator as unknown) === true) {
      collection.models = collection.models.filter((model) => model[key as string])
    } else if ((operator as unknown) === false) {
      collection.models = collection.models.filter((model) => !model[key as string])
    } else {
      if (value === undefined) {
        comparisonValue = operator as V
        comparisonOperator = '==='
      }

      collection.models = this.models.filter((model) => {
        return compareValues(model[key as string], comparisonValue as V, comparisonOperator as Operator)
      })
    }

    return collection
  }

  /**
   * Removes all models from this collection.
   */
  public clear(): void {
    this._clearModels()
  }

  /**
   * Called when a model has been removed from this collection.
   */
  protected onRemove(model: Model): void {
    model.$unregisterCollection(this)
    this._removeModelFromRegistry(model)
  }

  /**
   * Called when a model has been added to this collection.
   */
  protected onAdd(model: Model): void {
    model.$registerCollection(this)
    this._addModelToRegistry(model)
  }

  /**
   * Return the zero-based index of the given model in this collection.
   *
   * @returns The index of a model in this collection, or -1 if not found.
   */
  private _indexOf(model: Model): number {
    if (!this._hasModelInRegistry(model)) {
      return -1
    }

    return this.models.findIndex((m) => m.$uid === model.$uid)
  }

  /**
   * Remove a model from the model registry.
   */
  private _removeModelFromRegistry(model: Model): void {
    this._registry[model.$uid] = false
  }

  /**
   * @returns true if this collection has the model in its registry.
   */
  private _hasModelInRegistry(model: Model): boolean {
    return !!this._registry[model.$uid]
  }

  /**
   * Add a model from the model registry.
   */
  private _addModelToRegistry(model: Model): void {
    this._registry[model.$uid] = true
  }

  /**
   * Remove a model at a given index.
   *
   * @returns The model that was removed, or `undefined` if invalid.
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
    models.forEach((model) => {
      this.onRemove(model)
    })
  }

  /**
   * Creates a new instance of the collection.
   */
  private _createCollection(models: (M | Element)[] | SerializedCollection = [], options: Partial<CollectionOptions> = {}): this {
    return new (this.constructor as typeof Collection)(models, {
      ...this.getOptions(),
      ...options
    }) as this
  }

  /**
   * Get the constructor of this collection.
   */
  private _constructor(): typeof Collection {
    return this.constructor as typeof Collection
  }

  /**
   * Bootstrap this collection.
   */
  private _boot(options: CollectionOptions): void {
    this._generateUid()
    this.setOptions(options)
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
