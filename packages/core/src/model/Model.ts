import defu from 'defu'

import { Collection } from '../collection/Collection'
import * as Relations from '../relations'
import { RelationEnum } from '../relations/RelationEnum'
import { AttrMap } from '../support/AttrMap'
import { Map } from '../support/Map'
import { Uid as UidGenerator } from '../support/Uid'
import {
  assert,
  forceArray,
  isArray,
  isEmpty,
  isEmptyString,
  isFunction,
  isModel,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isUndefined,
  ValueOf
} from '../support/Utils'
import { Element, Item } from '../types/Data'
import { Mutators } from './Contracts'
import * as Contracts from './Contracts'
import { Field } from './field/Field'
import { mutateHasOne } from './field/utils/relation'
import * as Serialize from './Serialize'

export type ModelFields = Record<string, Field>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Field>
export type ModelReference<T> = Readonly<Omit<T, keyof Model>>

export interface ModelOptions {
  /**
   * Whether this model should fill the given attributes on instantiate.
   */
  fill?: boolean

  /**
   * Whether this model should fill relationships on instantiate.
   */
  relations?: boolean

  /**
   * Whether this model should allow an existing identifier to be
   * overwritten on update.
   */
  overwriteIdentifier?: boolean

  /**
   * Whether this model should perform a "patch" on update,
   * which will only send changed attributes in the request.
   */
  patch?: boolean

  /**
   * Whether this model should save even if no attributes have changed
   * since the last time they were synced. If set to `false` and no
   * changes have been made, the request will be considered a success.
   */
  saveUnchanged?: boolean

  /**
   * Allow custom options.
   */
  [key: string]: unknown
}

export class Model {
  /**
   * The name to be used for the model.
   */
  public static entity: string

  /**
   * The resource route of the model which is used to build the query.
   */
  public static resource: string

  /**
   * The primary key to be used for the model.
   */
  public static primaryKey: string = 'id'

  /**
   * The schema for the model. It contains the result of the `fields`
   * method or the attributes defined by decorators.
   */
  private static _schemas: ModelSchemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the property decorators and gets evaluated, and stored, on the `schema`
   * property when registering models to the database.
   */
  private static _registries: ModelRegistries = {}

  /**
   * The array of booted models.
   */
  private static _booted: Record<string, boolean> = {}

  /**
   * The global lifecycle hook registries.
   */
  private static _globalHooks: Contracts.GlobalHooks = {}

  /**
   * The counter to generate the UID for global hooks.
   */
  private static _lastGlobalHookId: number = 0

  /**
   * Determines if the model is in saving state.
   */
  public $saving: boolean = false

  /**
   * Determines if the model is in deleting state.
   */
  public $deleting: boolean = false

  /**
   * Determines if the model is in fatal state.
   */
  public $fatal: boolean = false

  /**
   * The unique ID for the model.
   */
  public readonly $uid!: string

  /**
   * The saved state of attributes.
   */
  public readonly $: ModelReference<this> = {} as ModelReference<this>

  /**
   * The local hook registries.
   */
  private _localHooks: Contracts.LocalHooks = {}

  /**
   * The counter to generate the UID for local hooks.
   */
  private _lastLocalHookId: number = 0

  /**
   * The collections of the record.
   */
  private readonly _collections: Map<Collection<this>> = new Map<
    Collection<this>
  >()

  /**
   * The unmutated attributes of the record.
   */
  private readonly _attributes: AttrMap<unknown> = new AttrMap<unknown>()

  /**
   * The unmutated relationships of the record.
   */
  private readonly _relationships: AttrMap<Relations.Relation> =
    new AttrMap<Relations.Relation>()

  /**
   * The options of the record.
   */
  private readonly _options: Map<unknown> = new Map<unknown>()

  /**
   * Create a new model instance.
   */
  public constructor(
    attributes?: Element,
    collection: Collection | Collection[] | null = null,
    options: ModelOptions = {}
  ) {
    this._boot(options)

    // Register the given collection (if any) to the model. This is so that
    // the model can be added to the collection automatically when it is
    // created on save, or removed on delete.
    if (collection) {
      this.$registerCollection(collection as Collection<this>)
    }

    const fill = this.$getOption('fill') ?? true

    fill && this.$fill(attributes)
  }

  /**
   * Get the model's ID.
   */
  public get $id(): string | number | null {
    return this.$constructor().getIdFromRecord(this)
  }

  /**
   * Get the primary key for the model.
   */
  public get $primaryKey(): string {
    return this.$constructor().primaryKey
  }

  /**
   * Determines whether the model has an ID.
   */
  public get $hasId(): boolean {
    return this.$constructor().isValidId(this.$id)
  }

  /**
   * Get the resource route of the model.
   */
  public get $resource(): string {
    return this.$constructor().getResource()
  }

  /**
   * Get the {@link entity} for this model.
   */
  public get $entity(): string {
    return this.$constructor().entity
  }

  public get $collections(): Collection<this>[] {
    return Object.values(this._collections.toArray())
  }

  /**
   * The options of the model.
   */
  public static options(): ModelOptions {
    return {}
  }

  /**
   * The definition of the fields of the model and its relations.
   */
  public static fields(): Record<string, any> {
    return {}
  }

  /**
   * Set the attribute to the registry.
   */
  public static setRegistry(key: string, attribute: () => Field): typeof Model {
    if (!this._registries[this.entity]) {
      this._registries[this.entity] = {}
    }

    this._registries[this.entity][key] = attribute

    return this
  }

  /**
   * Clear the list of booted models so they can be re-booted.
   */
  public static clearBootedModels(): void {
    this._booted = {}
    this._schemas = {}
  }

  /**
   * Clear registries.
   */
  public static clearRegistries(): void {
    this._registries = {}
  }

  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  public static mutators(): Mutators {
    return {}
  }

  /**
   * Get the {@link Model} schema definition from the {@link _schemas}.
   */
  public static getFields(): ModelFields {
    this._boot()

    return this._schemas[this.entity]
  }

  /**
   * Check if the given key is the primary key.
   */
  public static isPrimaryKey(key: string): boolean {
    return this.primaryKey === key
  }

  /**
   * Get the id (value of primary key) from the given record. If primary key is
   * not present, or it is invalid primary key value, which is other than
   * `string` or `number`, it's going to return `null`.
   */
  public static getIdFromRecord<M extends typeof Model>(
    this: M,
    record: InstanceType<M> | Element
  ): string | number | null {
    // Get the primary key value from attributes.
    const value = isModel(record)
      ? record._attributes.get(this.primaryKey)
      : record[this.primaryKey]

    return this.getIdFromValue(value)
  }

  /**
   * Get correct index id, which is `string` | `number`, from the given value.
   */
  public static getIdFromValue(value: unknown): string | number | null {
    if (this.isValidId(value)) {
      return value
    }

    return null
  }

  /**
   * @returns {*} A potential ID parsed from response data.
   */
  public static parseId<T = unknown>(data: T): T {
    return data
  }

  /**
   * Get the resource route of the model.
   */
  public static getResource(): string {
    return this.resource || this.entity
  }

  /**
   * Determines whether the record has an ID.
   */
  public static hasId<M extends typeof Model>(
    this: M,
    record: InstanceType<M> | Element
  ): boolean {
    return this.isValidId(this.getIdFromRecord(record))
  }

  /**
   * Determines whether the ID is valid.
   */
  public static isValidId(value: unknown): value is string | number {
    if (isString(value) && !isEmptyString(value)) {
      return true
    }

    if (isNumber(value)) {
      return true
    }

    return false
  }

  /**
   * Fill any missing fields in the given record with the default value defined
   * in the model schema.
   */
  public static hydrate(record?: Element): Element {
    return new this(record).$getAttributes()
  }

  /**
   * Determines whether the model has the given relationship.
   */
  public static hasRelation(relationship: typeof Model): boolean {
    return Object.values(this.getFields()).some(
      (field) => field.relation && field.type === relationship
    )
  }

  /**
   * Register a global hook. It will return ID for the hook that users may use
   * it to unregister hooks.
   */
  public static on(on: string, callback: Contracts.HookableClosure): number {
    const id = ++this._lastGlobalHookId

    if (!this._globalHooks[on]) {
      this._globalHooks[on] = []
    }

    this._globalHooks[on].push({ id, callback })

    return id
  }

  /**
   * Unregister global hook with the given id.
   */
  public static off(id: number): boolean {
    return Object.keys(this._globalHooks).some((on) => {
      const hooks = this._globalHooks[on]

      const index = hooks.findIndex((h) => h.id === id)

      if (index === -1) {
        return false
      }

      hooks.splice(index, 1)

      return true
    })
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  private static _initializeSchema(): void {
    this._schemas[this.entity] = {}
    const fields = this.fields()
    const _fields = {}

    for (const key in this.fields()) {
      _fields[key] = new Field(key, fields[key], this)
    }

    const registry = {
      ..._fields,
      ...this._registries[this.entity]
    }

    for (const key in registry) {
      const attribute = registry[key]

      this._schemas[this.entity][key] = isFunction(attribute)
        ? attribute()
        : attribute
    }
  }

  /**
   * Bootstrap this model.
   */
  private static _boot(): void {
    if (!this._booted[this.entity]) {
      this._booted[this.entity] = true

      this._initializeSchema()
    }
  }

  /**
   * Build executable hook collection for the given hook.
   */
  private static _buildGlobalHooks(on: string): Contracts.HookableClosure[] {
    const hooks = this._getGlobalHookAsArray(on)
    const staticHook = this[on] as Contracts.HookableClosure | undefined

    staticHook && hooks.push(staticHook.bind(this))

    return hooks
  }

  /**
   * Get global hook of the given name as array by stripping id key and keep
   * only hook functions.
   */
  private static _getGlobalHookAsArray(
    on: string
  ): Contracts.HookableClosure[] {
    const hooks = this._globalHooks[on]

    return hooks ? hooks.map((h) => h.callback.bind(this)) : []
  }

  /**
   * Get the default options of the model.
   */
  private static _getDefaultOptions(): ModelOptions {
    return {
      fill: true,
      relations: true,
      overwriteIdentifier: false,
      patch: false,
      saveUnchanged: true
    }
  }

  /**
   * Get the constructor of this model.
   */
  public $constructor(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Registers a collection on this model. When this model is created it will
   * automatically be added to the collection. Similarly, when this model is
   * delete it will be remove from the collection. Registering the same
   * collection more than once has no effect.
   *
   * @param collection
   */
  public $registerCollection(
    collection: Collection<this> | Collection<this>[]
  ): void {
    if (isArray(collection)) {
      for (const c of collection) {
        this.$registerCollection(c)
      }

      return
    }

    assert(!isNullish(collection) && !isUndefined(collection.$uid), [
      'Collection is not valid.'
    ])

    this._collections.set(collection.$uid, collection)
  }

  /**
   * Removes a collection from this model's collection registry, removing all
   * effects that would occur when creating or deleting this model.
   *
   * Unregistering a collection that isn't registered has no effect.
   *
   * @param collection
   */
  public $unregisterCollection(
    collection: Collection<this> | Collection<this>[]
  ): void {
    if (isArray(collection)) {
      for (const c of collection) {
        this.$unregisterCollection(c)
      }

      return
    }

    assert(!isNullish(collection) && !isUndefined(collection.$uid), [
      'Collection is not valid.'
    ])

    this._collections.delete(collection.$uid)
  }

  /**
   * Set the model options.
   */
  public $setOptions(options: ModelOptions): void {
    const _options = {
      ...this.$constructor()._getDefaultOptions(),
      ...this.$constructor().options(),
      ...options
    }

    for (const key in _options) {
      this._options.set(key, _options[key])
    }
  }

  /**
   * Get the model options.
   */
  public $getOptions(): ModelOptions {
    return this._options.toArray() as unknown as ModelOptions
  }

  /**
   * Set a model's option.
   */
  public $setOption<K extends keyof ModelOptions>(
    key: K,
    value: ValueOf<ModelOptions, K>
  ): void {
    return this._options.set(key as string, value)
  }

  /**
   * Get a model's option.
   */
  public $getOption<K extends keyof ModelOptions>(
    key: K,
    fallback?: ValueOf<ModelOptions, K>
  ): ValueOf<ModelOptions, K> {
    return (
      (this._options.get(key as string) as ValueOf<ModelOptions, K>) ?? fallback
    )
  }

  /**
   * Get the model fields for this model.
   */
  public $fields(): ModelFields {
    return this.$constructor().getFields()
  }

  /**
   * Get a model field for this model.
   */
  public $getField(attribute: string): Field {
    const fields = this.$fields()

    assert(attribute in fields, [
      `You must define the attribute "${attribute}" in fields().`
    ])

    return fields[attribute]
  }

  /**
   * Set the value of an attribute and registers the magic "getter". This method should always be
   * used when setting the value of an attribute.
   *
   * @returns The value that was set.
   */
  public $set<T = any>(attribute: string | Element, value?: T): T | undefined {
    // Allow batch set of multiple attributes at once, ie. $set({...});
    if (isPlainObject(attribute)) {
      const fields = this.$fields()

      for (const key in fields) {
        if (!(key in attribute)) {
          continue
        }

        this.$set(key, attribute[key])
      }

      return
    }

    const defined = attribute in this

    // Only register the pass-through property if it's not already set up.
    // If it already exists on the instance, we know it has been.
    if (!defined) {
      this._registerAttribute(attribute)
      this._registerReference(attribute)
    } else {
      const beforeSet = this.$emit('beforeSet', { attribute, value })

      // Don't set if the hook return false.
      if (beforeSet === false) {
        return
      }
    }

    // Current value of the attribute, or `undefined` if not set
    const previous: any = this._getAttribute(attribute)
    const field = this.$getField(attribute)

    // If we have a relationship that was previous defined, we need to access it and set the given attribute,
    // so we don't generate a new model instance.
    if (field.relation && previous instanceof Relations.Relation) {
      switch (field.relation) {
        // It's the "Has One" relation, so we access the model and set the attribute.
        case RelationEnum.HAS_ONE: {
          const model = previous.data as Item

          if (isNull(model)) {
            previous.data = mutateHasOne(value as Element, previous.model)
          } else {
            model.$set(value as Element)
          }

          break
        }
        // It's the "Has Many" relation, so we access the collection and loop through its models,
        // then set attributes of each one of them.
        case RelationEnum.HAS_MANY: {
          const collection = previous.data as Collection
          let _value: unknown = value

          if (_value instanceof Relations.Relation) {
            _value = (_value.data as Collection).map((model) => model.$toJson())
          }

          collection.set(_value as Element | Element[])
          break
        }
      }

      // Otherwise, we just resolve the value
    } else {
      // Resolve the value
      value = field.make(value, this)

      // Set the attribute value.
      this._setAttribute(attribute, value)
    }

    // TODO: Deep equality comparison
    // Only consider a change if the attribute was already defined.
    const changed: boolean = defined && previous !== value

    if (changed) {
      // Emit the change event after
      this.$emit('change', { attribute, previous, value })
    }

    return value
  }

  /**
   * Return an attribute's value or a fallback value
   * if this model doesn't have the attribute.
   *
   * @returns The value of the attribute or `fallback` if not found.
   */
  public $get(attribute: string, fallback?: unknown): any {
    let value = this._getAttribute(attribute)

    // Use the fallback if the value is undefined.
    if (isUndefined(value)) {
      value = fallback
    }

    return value
  }

  /**
   * Return an attribute's reference value or a fallback value
   * if this model doesn't have the attribute.
   *
   * This is useful in cases where you want to display an attribute but also
   * change it. For example, a modal with a title based on a model field, but
   * you're also editing that field. The title will be updating reactively if
   * it's bound to the active attribute, so bind to the saved one instead.
   *
   * @returns The value of the attribute's reference or `fallback` if not found.
   */
  public $saved(attribute: string, fallback?: unknown): any {
    let value = this._getReference(attribute)

    // Use the fallback if the value is undefined.
    if (isUndefined(value)) {
      value = fallback
    }

    return value
  }

  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   */
  public $fill(attributes: Element = {}, options: ModelOptions = {}): void {
    const fields = this.$fields()
    const fillRelation =
      options.relations ?? this.$getOption('relations') ?? true

    for (const key in fields) {
      const field = fields[key]
      let value = attributes[key]

      // Some times we might not want to fill relationships
      if (field.relation && !fillRelation) {
        continue
      }

      // It's not a requirement to respond with a complete dataset, so we merge with current data.
      if (isUndefined(value)) {
        value = this._getAttribute(key)
      }

      // We must get the data from relationships
      if (field.relation && value instanceof Relations.Relation) {
        value = value.data
      }

      this.$set(key, value)
    }
  }

  /**
   * Update this model by the given attributes.
   */
  public $update(
    attributes: Element | string | number | null | undefined = undefined,
    options: ModelOptions = {}
  ): void {
    // No content means we don't want to update the model at all.
    // The attributes that we passed in the request should now be considered
    // the source of truth, so we should update the reference attributes here.
    if (!attributes || (isObject(attributes) && isEmpty(attributes))) {
      // We need to sync changes before references
      this.$syncChanges()
      this.$syncReference()

      // A plain object implies that we want to update the model data.
      // It's not a requirement to respond with a complete dataset,
      // eg. a response to a patch request might return partial data.
    } else if (isPlainObject(attributes)) {
      this.$fill(attributes, options)

      // We need to sync changes before references
      this.$syncChanges()
      this.$syncReference()

      // We also need to sync all relationships that have been modified.
      // To do so, we loop through the attributes.
      const fields = this.$fields()

      for (const key in fields) {
        if (!(key in attributes)) {
          continue
        }

        // Get the field by attribute's key
        const field = fields[key]

        // Then, we check if the field is a relationship.
        if (field.relation) {
          // If so, we get the relationship.
          const relation = this._relationships.get(key)

          // Now we switch between the different types of relations.
          switch (field.relation) {
            // It's the "Has One" relation, so we access the model and sync it.
            case RelationEnum.HAS_ONE: {
              const model = relation.data as Item

              if (!isNull(model)) {
                // We need to sync changes before references
                model.$syncChanges()
                model.$syncReference()
              }
              break
            }
            // It's the "Has Many" relation, so we access the collection and loop through its models,
            // then sync each one of them.
            case RelationEnum.HAS_MANY: {
              const collection = relation.data as Collection

              for (const record of attributes[key]) {
                // Get the ID from model or record
                const id = this.$constructor().getIdFromRecord(record)

                // If we don't have an ID, we can't compare the model
                if (isNull(id)) {
                  break
                }

                // Retrieve a model from the collection based on the given ID
                const model = collection.find(id)

                // If we couldn't retrieve a model from the collection
                if (isNull(model)) {
                  break
                }

                // At this point, `model` should be an instance of Model.
                if (!isModel(model)) {
                  break
                }

                // We need to sync changes before references
                model.$syncChanges()
                model.$syncReference()
              }
              break
            }
          }
        }
      }

      // There is some data, but it's not an object, so we can assume that the
      // response only returned an ID for this model.
    } else {
      const id = this.$constructor().parseId(attributes)

      // It's possible that the response didn't actually return a valid
      // ID, so before we try to use it we should make sure that
      // we're not accidentally assigning the wrong data as ID.
      if (this.$constructor().isValidId(id)) {
        // If an ID already exists on this model and the returned
        // ID is not the same, this almost definitely indicates
        // an unexpected state. The default is to protect against this
        // and fail hard, but this might not always be what we want.
        if (this.$hasId && id !== this.$id) {
          if (!this.$shouldAllowIdentifierOverwrite()) {
            assert(true, ['Not allowed to overwrite model ID.'])
          }
        }

        // Update the ID and sync the saved attributes.
        this[this.$primaryKey] = id
        this.$syncReference()
      } else {
        assert(true, [
          'Expected an empty response, object, or valid identifier.'
        ])
      }
    }
  }

  /**
   * Serialize given model POJO.
   */
  public $serialize(options: Serialize.SerializeOptions = {}): Element {
    const _option = {
      ...Serialize.defaultOptions,
      ...options
    }

    const fields = this.$fields()
    const result: Element = {}

    for (const key in fields) {
      const field = fields[key]

      // Exclude read-only attributes for requests.
      if (field.readOnly && _option.isRequest) {
        continue
      }

      if (field.relation) {
        if (_option.shouldPatch && this._relationships.isClean(key)) {
          continue
        }

        const value = this._relationships.get(key).data

        result[key] = _option.relations
          ? Serialize.relation(value, _option.isRequest)
          : Serialize.emptyRelation(value)
      } else {
        if (_option.shouldPatch && this._attributes.isClean(key)) {
          continue
        }

        const value = this._attributes.get(key)
        result[key] = Serialize.value(value)
      }
    }

    return result
  }

  /**
   * Get all of the current attributes on the model. This method is mainly used when saving a model.
   */
  public $getAttributes(): Element {
    return this.$serialize({ relations: false })
  }

  /**
   * Serialize this model, or the given model, as POJO.
   */
  public $toJson(
    model?: Model,
    options: Serialize.SerializeOptions = {}
  ): Element {
    return (model ?? this).$serialize(options)
  }

  /**
   * Adds this model to all registered collections.
   */
  public $addToAllCollections(): void {
    for (const collection of this.$collections) {
      collection.add(this)
    }
  }

  /**
   * Removes this model from all registered collections.
   */
  public $removeFromAllCollections(): void {
    for (const collection of this.$collections) {
      collection.remove(this)
    }
  }

  /**
   * Determine if the model or any of the given attribute(s) have been modified.
   */
  public $isDirty(attributes?: string | string[]): boolean {
    return (
      this._attributes.isDirty(attributes) ||
      this._relationships.isDirty(attributes)
    )
  }

  /**
   * Determine if the model and all the given attribute(s) have remained the same.
   */
  public $isClean(attributes?: string | string[]): boolean {
    return !this.$isDirty(attributes)
  }

  /**
   * Determine if the model or any of the given attribute(s) have been modified.
   */
  public $wasChanged(attributes?: string | string[]): boolean {
    return (
      this._attributes.wasChanged(attributes) ||
      this._relationships.wasChanged(attributes)
    )
  }

  public $getDirty(): Record<string, any> {
    return { ...this._attributes.getDirty(), ...this._relationships.getDirty() }
  }

  public $getChanges(): Record<string, any> {
    return {
      ...this._attributes.getChanges(),
      ...this._relationships.getChanges()
    }
  }

  /**
   * Sync the reference attributes with the current.
   */
  public $syncReference(attributes?: string | string[]): this {
    // A copy of the saved state before the attributes were synced.
    const before = this._getReferences()

    // Sync attributes
    this._attributes.syncReference(attributes)
    this._relationships.syncReference(attributes)

    /*const fields = this.$fields()

    for (const key in fields) {
      const field = fields[key]

      if (field.relation) {
        const relation = this._relationships.get(key)

        switch (field.relation) {
          case RelationEnum.HAS_ONE: {
            const model = relation.data as Item

            if (!isNull(model)) {
              model.$syncReference()
            }
            break
          }
          case RelationEnum.HAS_MANY: {
            const collection = relation.data as Collection
            collection.syncReference()
            break
          }
          default: {
            //
          }
        }
      }
    }*/

    // A copy of the saved state after the attributes were synced.
    const after = this._getReferences()

    // Emit syncReference event
    this.$emit('syncReference', {
      attributes: attributes
        ? forceArray(attributes)
        : Object.keys(this.$fields()),
      before,
      after
    })

    return this
  }

  /**
   * Sync the changed attributes.
   */
  public $syncChanges(): this {
    // A copy of the state before the changes were synced.
    const before = this.$getChanges()

    // Sync changes
    this._attributes.syncChanges()
    this._relationships.syncChanges()

    // A copy of the state after the changes were synced.
    const after = this.$getChanges()

    // Emit syncChanges event
    this.$emit('syncChanges', {
      before,
      after
    })

    return this
  }

  /**
   * Reverts all attributes and relationships back to their defaults. This will also sync the reference
   * attributes and relationships, and is not reversible.
   */
  public $clear(): void {
    // A copy of the active state before the attributes were cleared.
    const before = this._getAttributes()

    // Clear attributes and state
    this.$clearAttributes()
    this.$clearState()

    // A copy of the active state after the attributes were cleared.
    const after = this._getAttributes()

    // Emit clear event
    this.$emit('clear', {
      before,
      after
    })
  }

  /**
   * Reverts all attributes back to their defaults. This will also sync the reference
   * attributes, and is not reversible.
   */
  public $clearAttributes(): void {
    for (const key in this.$fields()) {
      this[key] = undefined
    }

    this._attributes.syncReference()
    this._relationships.syncReference()
  }

  /**
   * Resets model state, ie. `saving`, etc back to their initial states.
   */
  public $clearState(): void {
    this.$saving = false
    this.$deleting = false
    this.$fatal = false
  }

  /**
   * Resets attributes back to their reference values (source of truth).
   * A good use case for this is when form fields are bound directly to the
   * model's attributes. Changing values in the form fields will change the
   * attributes on the model. On cancel, you can revert the model back to
   * its saved, original state using reset().
   *
   * It's also possible to pass an array of attributes to reset.
   */
  public $reset(attributes?: string | string[]): void {
    // A copy of the active state before the attributes were reset.
    const before = this._getAttributes()

    // Reset attributes
    this._attributes.reset(attributes)
    this._relationships.reset(attributes)

    // A copy of the active state after the attributes were reset.
    const after = this._getAttributes()

    // Emit reset event
    this.$emit('reset', {
      attributes: attributes
        ? forceArray(attributes)
        : Object.keys(this.$fields()),
      before,
      after
    })
  }

  /**
   * Returns whether this model should perform a "patch" on update, which will
   * only send changed data in the request, rather than all attributes.
   */
  public $shouldPatch(): boolean {
    return Boolean(this.$getOption('patch'))
  }

  /**
   * Returns whether this model allows an existing identifier to be overwritten on update.
   */
  public $shouldAllowIdentifierOverwrite(): boolean {
    return Boolean(this.$getOption('overwriteIdentifier'))
  }

  /**
   * Execute mutation hooks to the given model.
   */
  public $emit(event: string, context: Record<string, any> = {}): void | false {
    const hooks: Contracts.MutationHook[] = []

    // Build global hooks
    hooks.push(...this.$constructor()._buildGlobalHooks(event))

    // Build local hooks
    hooks.push(...this._buildLocalHooks(event))

    if (hooks.length === 0) {
      return
    }

    context = defu(context, this._getDefaultEventContext())

    for (const hook of hooks) {
      const result = hook(context as Parameters<Contracts.MutationHook>['0'])

      if (result === false) {
        return false
      }
    }
  }

  /**
   * Register a local hook. It will return ID for the hook that users may use
   * it to unregister hooks.
   */
  public $on(on: string, callback: Contracts.HookableClosure): number {
    const id = ++this._lastLocalHookId

    if (!this._localHooks[on]) {
      this._localHooks[on] = []
    }

    this._localHooks[on].push({ id, callback })

    return id
  }

  /**
   * Unregister local hook with the given id.
   */
  public $off(id: number): boolean {
    return Object.keys(this._localHooks).some((on) => {
      const hooks = this._localHooks[on]

      const index = hooks.findIndex((h) => h.id === id)

      if (index === -1) {
        return false
      }

      hooks.splice(index, 1)

      return true
    })
  }

  /**
   * Serialize this model as POJO.
   */
  protected toJSON(): Element {
    return this.$toJson()
  }

  /**
   * Bootstrap this model.
   */
  private _boot(options: ModelOptions): void {
    this.$constructor()._boot()
    this._generateUid()
    this.$setOptions(options)
  }

  /**
   * Generate an unique ID for the model.
   */
  private _generateUid(): void {
    // If the model's UID is not available, generate a new one.
    let uid = this.$uid ?? UidGenerator.make('model')

    // Force UID to be an string.
    uid = String(uid)

    // Define the $uid property.
    Object.defineProperty(this, '$uid', {
      value: uid,
      enumerable: false,
      configurable: true,
      writable: false
    })
  }

  /**
   * Register an attribute on this model so that it can be accessed directly
   * on the model, passing through `get` and `set`.
   */
  private _registerAttribute(attribute: string): void {
    // Create dynamic accessors and mutations so that we can update the
    // model directly while also keeping the model attributes in sync.
    Object.defineProperty(this, attribute, {
      get: (): any => this.$get(attribute),
      set: <T>(value: T): T | undefined => this.$set(attribute, value)
    })
  }

  /**
   * Register an attribute's reference on this model so that it can be accessed directly
   * on the model, passing through `get`.
   */
  private _registerReference(attribute: string): void {
    // Create dynamic accessors and mutations so that we can update the
    // model directly while also keeping the model attributes in sync.
    Object.defineProperty(this.$, attribute, {
      get: (): any => this.$saved(attribute),

      set: (): void =>
        assert(false, ["The saved state of a property can't be overridden."])
    })
  }

  /**
   * Set an attribute in `{@link _attributes}` or {@link _relationships}, based on field type.
   */
  private _setAttribute(attribute: string, value: any): any {
    const field = this.$getField(attribute)

    // Set the attribute based on field type.
    if (field.relation) {
      this._relationships.set(attribute, value)
    } else {
      this._attributes.set(attribute, value)
    }

    return value
  }

  /**
   * Get an attribute from {@link _attributes} or {@link _relationships}, based on field type.
   *
   * @returns The unmutated value of attribute.
   */
  private _getAttribute(attribute: string): any {
    const field = this.$getField(attribute)
    let value: any

    // Get the attribute based on field type.
    if (field.relation) {
      value = this._relationships.get(attribute)
    } else {
      value = this._attributes.get(attribute)
    }

    return value
  }

  /**
   * Get all attributes from {@link _attributes} and {@link _relationships}.
   *
   * Do not confuse with the public method {@link $getAttributes},
   * which serializes the model and get all attributes without relationships.
   *
   * @returns The unmutated attributes.
   */
  private _getAttributes(): Record<string, any> {
    const attributes = {}

    for (const field of Object.keys(this.$fields())) {
      attributes[field] = this._getAttribute(field)
    }

    return attributes
  }

  /**
   * Get an attribute's reference from {@link _attributes} or {@link _relationships}, based on field type.
   *
   * @returns The unmutated value of attribute's reference.
   */
  private _getReference(attribute: string): any {
    const field = this.$getField(attribute)
    let value: any

    // Get the attribute based on field type.
    if (field.relation) {
      value = this._relationships.$get(attribute)
    } else {
      value = this._attributes.$get(attribute)
    }

    return value
  }

  /**
   * Get references of all attributes from {@link _attributes} and {@link _relationships}.
   *
   * @returns The unmutated references of attributes.
   */
  private _getReferences(): Record<string, any> {
    const references = {}

    for (const field of Object.keys(this.$fields())) {
      references[field] = this._getReference(field)
    }

    return references
  }

  /**
   * Get local hook of the given name as array by stripping id key and keep
   * only hook functions.
   */
  private _getLocalHookAsArray(on: string): Contracts.HookableClosure[] {
    const hooks = this._localHooks[on]

    return hooks ? hooks.map((h) => h.callback.bind(this)) : []
  }

  /**
   * Build executable hook collection for the given hook.
   */
  private _buildLocalHooks(on: string): Contracts.HookableClosure[] {
    return this._getLocalHookAsArray(on)
  }

  /**
   * Returns the default context for all events emitted by this instance.
   *
   * @returns {Object}
   */
  private _getDefaultEventContext(): { model: Model; entity: string } {
    return { model: this, entity: this.$entity }
  }
}
