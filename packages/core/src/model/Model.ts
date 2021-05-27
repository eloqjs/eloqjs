import * as Attributes from '../attributes'
import { Mutator, Mutators } from '../attributes/Contracts'
import { Collection } from '../collection/Collection'
import * as Relations from '../relations'
import { AttrMap } from '../support/AttrMap'
import { Map } from '../support/Map'
import { Uid as UidGenerator } from '../support/Uid'
import {
  assert,
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
import * as Contracts from './Contracts'
import * as Serialize from './Serialize'

export type ModelFields = Record<string, Attributes.Attribute>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attributes.Attribute>
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
   * Attributes that should be read-only.
   * These attributes will be excluded from the payload when saving.
   */
  protected static readOnlyAttributes: string[] = []

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
  private static _hooks: Contracts.GlobalHooks = {}

  /**
   * The counter to generate the UID for global hooks.
   */
  private static _lastHookId: number = 0

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
  private readonly _relationships: AttrMap<Relations.Relation> = new AttrMap<Relations.Relation>()

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
    return this.$self().getIdFromRecord(this)
  }

  /**
   * Get the primary key for the model.
   */
  public get $primaryKey(): string {
    return this.$self().primaryKey
  }

  /**
   * Determines whether the model has an ID.
   */
  public get $hasId(): boolean {
    return this.$self().isValidId(this.$id)
  }

  /**
   * Get the resource route of the model.
   */
  public get $resource(): string {
    return this.$self().getResource()
  }

  /**
   * Get the {@link entity} for this model.
   */
  public get $entity(): string {
    return this.$self().entity
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
  public static fields(): ModelFields {
    return {}
  }

  /**
   * Set the attribute to the registry.
   */
  public static setRegistry(
    key: string,
    attribute: () => Attributes.Attribute
  ): typeof Model {
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
    const fields = this.getFields()
    let flag = false

    for (const key in fields) {
      const field = fields[key]

      if (field instanceof Attributes.Relation) {
        flag = field.related === relationship

        if (flag) {
          break
        }
      }
    }

    return flag
  }

  /**
   * Register a global hook. It will return ID for the hook that users may use
   * it to unregister hooks.
   */
  public static on(on: string, callback: Contracts.HookableClosure): number {
    const id = ++this._lastHookId

    if (!this._hooks[on]) {
      this._hooks[on] = []
    }

    this._hooks[on].push({ id, callback })

    return id
  }

  /**
   * Unregister global hook with the given id.
   */
  public static off(id: number): boolean {
    return Object.keys(this._hooks).some((on) => {
      const hooks = this._hooks[on]

      const index = hooks.findIndex((h) => h.id === id)

      if (index === -1) {
        return false
      }

      hooks.splice(index, 1)

      return true
    })
  }

  /**
   * Execute mutation hooks to the given model.
   */
  public static executeMutationHooks<M extends Item>(on: string, model: M): M {
    const hooks = this._buildHooks(on) as Contracts.MutationHook[]

    if (hooks.length === 0 || isNull(model)) {
      return model
    }

    return hooks.reduce((m, hook) => {
      hook(m as Model, this.entity)
      return m
    }, model)
  }

  /**
   * Create an attr attribute.
   */
  protected static attr(
    value?: unknown,
    mutator?: Mutator<any>
  ): Attributes.Attr {
    return new Attributes.Attr(this, value, mutator)
  }

  /**
   * Create a string attribute.
   */
  protected static string(
    value?: string | null,
    mutator?: Mutator<string | null>
  ): Attributes.String {
    return new Attributes.String(this, value, mutator)
  }

  /**
   * Create a number attribute.
   */
  protected static number(
    value?: number | null,
    mutator?: Mutator<number | null>
  ): Attributes.Number {
    return new Attributes.Number(this, value, mutator)
  }

  /**
   * Create a boolean attribute.
   */
  protected static boolean(
    value?: boolean | null,
    mutator?: Mutator<boolean | null>
  ): Attributes.Boolean {
    return new Attributes.Boolean(this, value, mutator)
  }

  /**
   * Create an uid attribute.
   */
  protected static uid(value?: () => string | number): Attributes.Uid {
    return new Attributes.Uid(this, value)
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
   * Build the schema by evaluating fields and registry.
   */
  private static _initializeSchema(): void {
    this._schemas[this.entity] = {}

    const registry = {
      ...this.fields(),
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
  private static _buildHooks(on: string): Contracts.HookableClosure[] {
    const hooks = this._getGlobalHookAsArray(on)
    const localHook = this[on] as Contracts.HookableClosure | undefined

    localHook && hooks.push(localHook.bind(this))

    return hooks
  }

  /**
   * Get global hook of the given name as array by stripping id key and keep
   * only hook functions.
   */
  private static _getGlobalHookAsArray(
    on: string
  ): Contracts.HookableClosure[] {
    const hooks = this._hooks[on]

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
  public $self(): typeof Model {
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
      ...this.$self()._getDefaultOptions(),
      ...this.$self().options(),
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
    return (this._options.toArray() as unknown) as ModelOptions
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
    return this.$self().getFields()
  }

  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   */
  public $fill(attributes: Element = {}, options: ModelOptions = {}): void {
    attributes =
      'data' in attributes ? (attributes.data as Element) : attributes
    const fields = this.$fields()
    const fillRelation =
      this.$getOption('relations') ?? options.relations ?? true

    for (const key in fields) {
      const field = fields[key]
      const value = attributes[key]

      // Define the getters and setters of attributes and relationships
      switch (true) {
        default:
        case field instanceof Attributes.Type: {
          if (!(key in this)) {
            this._defineAttribute(<Attributes.Type>field, key)
          }

          this[key] = isUndefined(value) ? this._attributes.get(key) : value

          break
        }
        case field instanceof Attributes.Relation && fillRelation: {
          if (!(key in this)) {
            this._defineRelation(<Attributes.Relation>field, key)
          }

          this[key] = isUndefined(value) ? this._relationships.get(key) : value
        }
      }
    }
  }

  /**
   * Update this model by the given attributes.
   */
  public $update(attributes?: Element | string | number | null): void {
    // No content means we don't want to update the model at all.
    // The attributes that we passed in the request should now be considered
    // the source of truth, so we should update the reference attributes here.
    if (!attributes || (isObject(attributes) && isEmpty(attributes))) {
      this.$syncReference()

      // A plain object implies that we want to update the model data.
      // It's not a requirement to respond with a complete dataset,
      // eg. a response to a patch request might return partial data.
    } else if (isPlainObject(attributes)) {
      this.$fill(attributes)
      this.$syncReference()

      // There is some data, but it's not an object, so we can assume that the
      // response only returned an ID for this model.
    } else {
      const id = this.$self().parseId(attributes)

      // It's possible that the response didn't actually return a valid
      // ID, so before we try to use it we should make sure that
      // we're not accidentally assigning the wrong data as ID.
      if (this.$self().isValidId(id)) {
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
  public $serialize(options: Serialize.Options = {}): Element {
    const _option = {
      ...Serialize.defaultOptions,
      ...options
    }

    const fields = this.$fields()
    const result: Element = {}

    for (const key in fields) {
      const field = fields[key]

      switch (true) {
        default:
        case field instanceof Attributes.Type: {
          if (_option.shouldPatch && this._attributes.isClean(key)) {
            continue
          }

          const value = this._attributes.get(key)

          // Exclude read-only attributes.
          if (!this.$self().readOnlyAttributes.includes(key)) {
            result[key] = Serialize.value(value)
          }

          break
        }
        case field instanceof Attributes.Relation: {
          if (_option.shouldPatch && this._relationships.isClean(key)) {
            continue
          }

          const value = this._relationships.get(key).data

          result[key] = _option.relations
            ? Serialize.relation(value, _option.isRequest)
            : Serialize.emptyRelation(value)
        }
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
  public $toJson(model?: Model, options: Serialize.Options = {}): Element {
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
    this._attributes.syncReference(attributes)
    this._relationships.syncReference(attributes)

    return this
  }

  /**
   * Sync the changed attributes.
   */
  public $syncChanges(): this {
    this._attributes.syncChanges()
    this._relationships.syncChanges()

    return this
  }

  /**
   * Reverts all attributes and relationships back to their defaults. This will also sync the reference
   * attributes and relationships, and is not reversible.
   */
  public $clear(): void {
    this.$clearAttributes()
    this.$clearState()
  }

  /**
   * Reverts all attributes back to their defaults. This will also sync the reference
   * attributes, and is not reversible.
   */
  public $clearAttributes(): void {
    const fields = this.$fields()

    for (const key in this.$fields()) {
      const field = fields[key]

      if (
        field instanceof Attributes.Type ||
        field instanceof Attributes.Relation
      ) {
        this[key] = undefined
      }
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
    this._attributes.reset(attributes)
    this._relationships.reset(attributes)
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
   * Serialize this model as POJO.
   */
  protected toJSON(): Element {
    return this.$toJson()
  }

  /**
   * Bootstrap this model.
   */
  private _boot(options: ModelOptions): void {
    this.$self()._boot()
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
   * Define an attribute in {@link _attributes}, then define its mutable field.
   *
   * @param field - The type of attribute field.
   * @param key - The key of the attribute.
   */
  private _defineAttribute(field: Attributes.Type, key: string) {
    const _attributes = this._attributes

    // Create a new field for the attribute.
    Object.defineProperty(this, key, {
      // Get the attribute, then apply the field mutation.
      get() {
        return field.make(_attributes.get(key), this, key)
      },

      // Set the new value to the attribute.
      set(newValue: unknown) {
        // If undefined, apply default value of the field.
        if (isUndefined(newValue)) {
          newValue = field.make(newValue, this, key, false)
        }

        // Set the new value to the attribute.
        _attributes.set(key, newValue)
      }
    })

    Object.defineProperty(this.$, key, {
      // Get the attribute, then apply the field mutation.
      get() {
        return field.make(_attributes.$get(key), this, key)
      },

      set() {
        assert(false, ["The saved state of a property can't be overridden."])
      }
    })
  }

  /**
   * Define a relationship in {@link _relationships}, then define its field.
   *
   * @param field - The type of attribute field.
   * @param key - The key of the attribute.
   */
  private _defineRelation(field: Attributes.Relation, key: string) {
    // Create a new field for the attribute.
    Object.defineProperty(this, key, {
      // Get the attribute, then apply the field mutation.
      get() {
        return this._relationships.get(key)
      },

      // Set the new value to the attribute.
      set(newValue: Element | Element[]) {
        // Initiate relation class.
        newValue = field.make(newValue, this, key)

        // Set the new value to the relation.
        this._relationships.set(key, newValue)
      }
    })
  }
}
