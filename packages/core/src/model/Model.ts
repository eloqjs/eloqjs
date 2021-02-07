import * as Attributes from '../attributes'
import { Mutator, Mutators } from '../attributes/Contracts'
import * as Relations from '../relations'
import { Map } from '../support/Map'
import { Uid as UidGenerator } from '../support/Uid'
import { assert } from '../support/Utils'
import { Element, Item } from '../types/Data'
import * as Contracts from './Contracts'
import * as Serialize from './Serialize'

export type ModelFields = Record<string, Attributes.Attribute>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attributes.Attribute>
export type ModelReference<T> = Omit<T, keyof Model>

export interface ModelOptions {
  fill?: boolean
  relations?: boolean
  isPayload?: boolean
  isPatch?: boolean
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
  private static schemas: ModelSchemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the property decorators and gets evaluated, and stored, on the `schema`
   * property when registering models to the database.
   */
  private static registries: ModelRegistries = {}

  /**
   * The array of booted models.
   */
  private static booted: Record<string, boolean> = {}

  /**
   * The global lifecycle hook registries.
   */
  private static hooks: Contracts.GlobalHooks = {}

  /**
   * The counter to generate the UID for global hooks.
   */
  private static lastHookId: number = 0

  /**
   * The unique ID for the model.
   */
  public readonly $uid!: string

  /**
   * The saved state of attributes.
   */
  public $: ModelReference<this> = {} as ModelReference<this>

  /**
   * The unmutated attributes of the record.
   */
  private $attributes: Map<unknown> = new Map<unknown>()

  /**
   * The unmutated relationships of the record.
   */
  private $relationships: Map<Relations.Relation> = new Map<Relations.Relation>()

  /**
   * Create a new model instance.
   */
  public constructor(attributes?: Element, options: ModelOptions = {}) {
    this.$boot()

    const fill = options.fill ?? true

    fill && this.$fill(attributes, options)
  }

  /**
   * Get the model's ID.
   */
  public get $id(): string | number | null {
    return this.$self().getIdFromRecord(this)
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
    if (!this.registries[this.entity]) {
      this.registries[this.entity] = {}
    }

    this.registries[this.entity][key] = attribute

    return this
  }

  /**
   * Clear the list of booted models so they can be re-booted.
   */
  public static clearBootedModels(): void {
    this.booted = {}
    this.schemas = {}
  }

  /**
   * Clear registries.
   */
  public static clearRegistries(): void {
    this.registries = {}
  }

  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  public static mutators(): Mutators {
    return {}
  }

  /**
   * Get the {@link Model} schema definition from the {@link schemas}.
   */
  public static getFields(): ModelFields {
    this.boot()

    return this.schemas[this.entity]
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
    const value =
      record instanceof Model
        ? record.$attributes.get(this.primaryKey)
        : record[this.primaryKey]

    return this.getIdFromValue(value)
  }

  /**
   * Get correct index id, which is `string` | `number`, from the given value.
   */
  public static getIdFromValue(value: unknown): string | number | null {
    if (typeof value === 'string' && value !== '') {
      return value
    }

    if (typeof value === 'number') {
      return value
    }

    return null
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
    return this.getIdFromRecord(record) !== null
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
  private static initializeSchema(): void {
    this.schemas[this.entity] = {}

    const registry = {
      ...this.fields(),
      ...this.registries[this.entity]
    }

    for (const key in registry) {
      const attribute = registry[key]

      this.schemas[this.entity][key] =
        typeof attribute === 'function' ? attribute() : attribute
    }
  }

  /**
   * Bootstrap this model.
   */
  private static boot(): void {
    if (!this.booted[this.entity]) {
      this.booted[this.entity] = true

      this.initializeSchema()
    }
  }

  /**
   * Register a global hook. It will return ID for the hook that users may use
   * it to unregister hooks.
   */
  public static on(on: string, callback: Contracts.HookableClosure): number {
    const id = ++this.lastHookId

    if (!this.hooks[on]) {
      this.hooks[on] = []
    }

    this.hooks[on].push({ id, callback })

    return id
  }

  /**
   * Unregister global hook with the given id.
   */
  public static off(id: number): boolean {
    return Object.keys(this.hooks).some((on) => {
      const hooks = this.hooks[on]

      const index = hooks.findIndex((h) => h.id === id)

      if (index === -1) {
        return false
      }

      hooks.splice(index, 1)

      return true
    })
  }

  /**
   * Build executable hook collection for the given hook.
   */
  private static buildHooks(on: string): Contracts.HookableClosure[] {
    const hooks = this.getGlobalHookAsArray(on)
    const localHook = this[on] as Contracts.HookableClosure | undefined

    localHook && hooks.push(localHook.bind(this))

    return hooks
  }

  /**
   * Get global hook of the given name as array by stripping id key and keep
   * only hook functions.
   */
  private static getGlobalHookAsArray(on: string): Contracts.HookableClosure[] {
    const hooks = this.hooks[on]

    return hooks ? hooks.map((h) => h.callback.bind(this)) : []
  }

  /**
   * Execute mutation hooks to the given model.
   */
  public static executeMutationHooks<M extends Item>(on: string, model: M): M {
    const hooks = this.buildHooks(on) as Contracts.MutationHook[]

    if (hooks.length === 0 || model === null) {
      return model
    }

    return hooks.reduce((m, hook) => {
      hook(m as Model, this.entity)
      return m
    }, model)
  }

  /**
   * Get the constructor of this model.
   */
  public $self(): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the primary key for the model.
   */
  public $primaryKey(): string {
    return this.$self().primaryKey
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
    const fillRelation = options.relations ?? true

    for (const key in fields) {
      const field = fields[key]
      const value = attributes[key]

      switch (true) {
        default:
        case field instanceof Attributes.Type: {
          this.$defineAttribute(<Attributes.Type>field, key, value)
          break
        }
        case field instanceof Attributes.Relation: {
          fillRelation &&
            this.$defineRelation(<Attributes.Relation>field, key, value)
        }
      }
    }
  }

  /**
   * Serialize given model POJO.
   */
  public $serialize(options: ModelOptions = {}): Element {
    const defaultOption: ModelOptions = {
      relations: true,
      isPayload: false,
      isPatch: false
    }
    const _option = {
      ...defaultOption,
      ...options
    } as Required<ModelOptions>

    const fields = this.$fields()
    const result: Element = {}

    for (const key in fields) {
      const field = fields[key]

      switch (true) {
        default:
        case field instanceof Attributes.Type: {
          if (_option.isPatch && !this.$attributes.isModified(key)) {
            continue
          }

          const value = this.$attributes.get(key)

          // Exclude read-only attributes.
          if (!this.$self().readOnlyAttributes.includes(key)) {
            result[key] = Serialize.value(value)
          }

          break
        }
        case field instanceof Attributes.Relation: {
          if (_option.isPatch && !this.$relationships.isModified(key)) {
            continue
          }

          const value = this.$relationships.get(key).data

          result[key] = _option.relations
            ? Serialize.relation(value, _option.isPayload)
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
  public $toJson(model?: Model, options: ModelOptions = {}): Element {
    return (model ?? this).$serialize(options)
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
  private $boot(): void {
    this.$self().boot()
    this._generateUid()
  }

  /**
   * Generate an unique ID for the model.
   */
  private _generateUid(): void {
    Object.defineProperty(this, '$uid', {
      value: UidGenerator.make('model'),
      enumerable: false,
      configurable: false,
      writable: false
    })
  }

  /**
   * Define an attribute in {@link $attributes}, then define its mutable field.
   *
   * @param field - The type of attribute field.
   * @param key - The key of the attribute.
   * @param value - The value of the attribute.
   */
  private $defineAttribute(
    field: Attributes.Type,
    key: string,
    value: unknown
  ) {
    const $attributes = this.$attributes

    // Create a new field for the attribute.
    Object.defineProperty(this, key, {
      // Get the attribute, then apply the field mutation.
      get() {
        return field.make($attributes.get(key), this, key)
      },

      // Set the new value to the attribute.
      set(newValue: unknown) {
        // If undefined, apply default value of the field.
        if (newValue === undefined) {
          newValue = field.make(newValue, this, key, false)
        }

        // Set the new value to the attribute.
        $attributes.set(key, newValue)
      }
    })

    Object.defineProperty(this.$, key, {
      // Get the attribute, then apply the field mutation.
      get() {
        return field.make($attributes.$get(key), this, key)
      },

      set() {
        assert(false, ["The saved state of a property can't be overridden."])
      }
    })

    // Set the value to the field of the attribute.
    this[key] = value
  }

  /**
   * Define a relationship in {@link $relationships}, then define its field.
   *
   * @param field - The type of attribute field.
   * @param key - The key of the attribute.
   * @param value - The value of the attribute.
   */
  private $defineRelation(
    field: Attributes.Relation,
    key: string,
    value: Element | Element[]
  ) {
    // Create a new field for the attribute.
    Object.defineProperty(this, key, {
      // Get the attribute, then apply the field mutation.
      get() {
        return this.$relationships.get(key)
      },

      // Set the new value to the attribute.
      set(newValue: Element | Element[]) {
        // Initiate relation class.
        newValue = field.make(newValue, this, key)

        // Set the new value to the relation.
        this.$relationships.set(key, newValue)
      }
    })

    // Set the value to the field of the attribute.
    this[key] = value
  }
}
