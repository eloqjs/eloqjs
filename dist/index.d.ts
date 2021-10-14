declare type Mutator<T> = (value: T) => T;
declare type Mutators = Record<string, Mutator<any>>;

declare type ValueOf<T, V extends keyof T = keyof T> = T[V];

declare type Element = Record<string, any>;
declare type Instance<M extends Model = Model> = M;
declare type Item<M extends Model = Model> = Instance<M> | null;

declare type Operator = '===' | '==' | '!==' | '!=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE';

interface CollectionOptions {
    model: typeof Model;
}
declare class Collection<M extends Model = Model> {
    protected static model: typeof Model;
    models: M[];
    /**
     * The unique ID for the collection.
     */
    readonly $uid: string;
    private readonly _options;
    private readonly _registry;
    constructor(models?: (M | Element)[], options?: Partial<CollectionOptions>);
    /**
     * Accessor to support Array.length semantics.
     */
    get length(): number;
    /**
     * Instantiate the given records.
     */
    private static _createModel;
    [Symbol.iterator](): Iterator<M>;
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
    add(models: (M | Element)[]): M[];
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
    add(model: M | Element): M;
    /**
     * Alias for the "avg" method.
     */
    average(key: keyof ModelReference<M> | string): number;
    /**
     * Returns the average of a property of all models in the collection.
     */
    avg(key: keyof ModelReference<M> | string): number;
    /**
     * Breaks the collection into multiple, smaller collections of a given size.
     *
     * @param size - Size of the chunks.
     */
    chunk(size: number): this[];
    /**
     * Creates a copy of this collection. Model references are preserved so
     * changes to the models inside the clone will also affect the subject.
     */
    clone(): this;
    /**
     * Returns the number of models in this collection.
     */
    count(): number;
    /**
     * Counts the occurrences of values in this collection.
     */
    countBy(callback: (model: M, index: number) => string): Record<string, number>;
    /**
     * Iterates through all models, calling a given callback for each one.
     */
    each(callback: (model: M, index: number, array: M[]) => unknown): boolean;
    /**
     * Returns all models in the collection except the models with specified keys.
     */
    except(keys: (string | number)[]): this;
    /**
     * Returns the first model that matches the given criteria.
     * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
     * primary key.
     * If `predicate` is an array of keys, find will return all models which match the keys.
     */
    find(key: string | number): Item<M>;
    /**
     * Returns the first model that matches the given criteria.
     * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
     * primary key.
     * If `predicate` is an array of keys, find will return all models which match the keys.
     */
    find(keys: (string | number)[]): Item<M>[];
    /**
     * Returns the first model that matches the given criteria.
     * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
     * primary key.
     * If `predicate` is an array of keys, find will return all models which match the keys.
     */
    find(model: M): Item<M>;
    /**
     * Returns the first model that matches the given criteria.
     * If `predicate` is a `string`, `number` or {@link Model}, `find` will attempt to return a model matching the
     * primary key.
     * If `predicate` is an array of keys, find will return all models which match the keys.
     */
    find<T = boolean>(predicate: (model: M) => T): Item<M>;
    /**
     * Returns the first model of this collection.
     */
    first(): Item<M>;
    /**
     * Returns a new collection containing the models that would be present on a given page number.
     * The method accepts the page number as its first argument
     * and the number of items to show per page as its second argument.
     */
    forPage(page: number, chunk: number): this;
    /**
     * Groups the models in this collection by a given key.
     */
    groupBy(key: keyof ModelReference<M> | string | ((model: M, index: number) => string)): Record<string, this>;
    /**
     * Determines whether this collection has the given model.
     *
     * It also accepts an array of models.
     *
     * @returns `true` if the collection contains the given model, `false` otherwise.
     */
    has(model: M | M[]): boolean;
    /**
     * Concatenate values of a given key as a string.
     *
     * @param key - The key of the attributes you wish to join.
     * @param glue - The "glue" string you wish to place between the values.
     */
    implode(key: keyof ModelReference<M> | string, glue: string): string;
    /**
     * Determines whether this collection is empty.
     *
     * @returns `true` if the collection is empty, `false` otherwise.
     */
    isEmpty(): boolean;
    /**
     * Determines whether this collection is not empty.
     *
     * @returns `true` if the collection is not empty, `false` otherwise.
     */
    isNotEmpty(): boolean;
    /**
     * Returns the last model of this collection.
     */
    last(): Item<M>;
    /**
     * Returns an array that contains the returned result after applying a
     * function to each model in this collection.
     */
    map<U = M>(callback: (model: M, index: number, array: M[]) => U): U[];
    /**
     * Returns the maximum value of a given key.
     */
    max(key: keyof ModelReference<M> | string): number;
    /**
     * Returns the [median value]{@link https://en.wikipedia.org/wiki/Median} of a given key.
     */
    median(key: keyof ModelReference<M> | string): number;
    /**
     * Returns the minimum value of a given key.
     */
    min(key: keyof ModelReference<M> | string): number;
    /**
     * Returns the [mode value]{@link https://en.wikipedia.org/wiki/Mode_(statistics)} of a given key.
     */
    mode(key: keyof ModelReference<M> | string): number[] | null;
    /**
     * Returns an array of primary keys.
     */
    modelKeys(): (string | number | null)[];
    /**
     * Creates a new collection consisting of every n-th model.
     */
    nth(step: number, offset?: number): this;
    /**
     * Returns only the models from the collection with the specified keys.
     */
    only(keys: (string | number)[]): this;
    /**
     * May be combined with destructuring to separate models
     * that pass a given truth test from those that do not.
     */
    partition(callback: (model: M) => boolean): [this, this];
    /**
     * Returns an array that contains the values for a given key for each model in this collection.
     */
    pluck<K extends keyof ModelReference<M>>(key: K): ValueOf<M, K>[];
    /**
     * Returns an array that contains the values for a given key for each model in this collection.
     */
    pluck(key: string): unknown[];
    /**
     * Returns an array that contains the values for a given key for each model in this collection.
     */
    pluck<K extends keyof ModelReference<M>>(key: K | string): ValueOf<M, K>[] | unknown[];
    /**
     * Removes and returns the last model of this collection, if there was one.
     *
     * @returns {Model|undefined} Removed model or undefined if there were none.
     */
    pop(): Item<M>;
    random(): Item<M>;
    random(length: number): this;
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
    reduce(iteratee: (result: M, model: M, index: number, array: M[]) => M): M;
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
    reduce(iteratee: (result: M, model: M, index: number, array: M[]) => M, initial: M): M;
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
    reduce<U = M>(iteratee: (result: U, model: M, index: number, array: M[]) => U, initial: U): U;
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
    remove(models: (M | Element)[]): M[] | undefined;
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
    remove(predicate: (model: M, index: number, array: M[]) => boolean): M[] | undefined;
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
    remove(model: M | Element): M | undefined;
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
    replace(models: (M | Element)[]): M[];
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
    replace(model: M | Element): M;
    /**
     * Resets all models in this collection. This method delegates to each model
     * so follows the same signature and effects as {@link Model.$reset}.
     */
    reset(attributes?: string | string[]): void;
    /**
     * Removes and returns the first model of this collection, if there was one.
     *
     * @returns Removed model or undefined if there were none.
     */
    shift(): Item<M>;
    /**
     * Randomly shuffles the models in this collection.
     */
    shuffle(): this;
    /**
     * Returns a new collection, without the first given amount of models.
     */
    skip(count: number): this;
    /**
     * Sorts this collection's models using a custom algorithm.
     */
    sort(callback: (a: M, b: M) => number): this;
    /**
     * Sorts this collection's models using a comparator.
     */
    sortBy(comparator: keyof ModelReference<M> | string | ((model: M) => string | number)): this;
    /**
     * Sorts this collection's models using a comparator, but in the opposite order.
     */
    sortByDesc(comparator: keyof ModelReference<M> | string | ((model: M) => string | number)): this;
    /**
     * Breaks a collection into the given number of groups.
     */
    split(size: number): this[];
    /**
     * Returns the sum of a property of all models in the collection.
     *
     * @param {string|string[]|Function} key
     * @returns {number}
     */
    sum(key: keyof ModelReference<M> | string | ((model: M) => string | number)): number;
    /**
     * Syncs the reference of all models in this collection. This method delegates to each model
     * so follows the same signature and effects as {@link Model.$syncReference}.
     */
    syncReference(attributes?: string | string[]): void;
    /**
     * Returns a new collection with the specified number of models.
     *
     * You may also pass a negative integer to take the specified amount of models from the end of the collection.
     */
    take(limit: number): this;
    /**
     * @returns A native representation of this collection that will
     * determine the contents of JSON.stringify(collection).
     */
    toJSON(): Model[];
    /**
     * Filters the collection by a given key / value pair.
     */
    where<V = unknown>(key: keyof ModelReference<M> | string, value?: V): this;
    /**
     * Filters the collection by a given key / value pair.
     */
    where<V = unknown>(key: keyof ModelReference<M> | string, operator: Operator, value: V): this;
    /**
     * Removes all models from this collection.
     */
    clear(): void;
    /**
     * Called when a model has been removed from this collection.
     *
     * @param {Model} model
     */
    protected onRemove(model: Model): void;
    /**
     * Called when a model has been added to this collection.
     *
     * @param {Model} model
     */
    protected onAdd(model: Model): void;
    /**
     * Return the zero-based index of the given model in this collection.
     *
     * @returns {number} the index of a model in this collection, or -1 if not found.
     */
    private _indexOf;
    /**
     * Remove a model from the model registry.
     *
     * @param {Model} model
     */
    private _removeModelFromRegistry;
    /**
     * @returns {Boolean} true if this collection has the model in its registry.
     */
    private _hasModelInRegistry;
    /**
     * Add a model from the model registry.
     *
     * @param {Model} model
     */
    private _addModelToRegistry;
    /**
     * Remove a model at a given index.
     *
     * @param {number} index
  
     * @returns {Model} The model that was removed, or `undefined` if invalid.
     * @throws {Error} If a model could not be found at the given index.
     */
    private _removeModelAtIndex;
    /**
     * Remove a {@link Model} from this collection.
     *
     * @param {Model} model
     *
     * @returns {Model}
     */
    private _removeModel;
    /**
     * Removes all models from this collection.
     */
    private _clearModels;
    /**
     * Creates a new instance of the collection.
     */
    private _createCollection;
    /**
     * Get the constructor of this collection.
     */
    private _self;
    /**
     * Bootstrap this collection.
     */
    private _boot;
    /**
     * Generate an unique ID for the collection.
     */
    private _generateUid;
}

declare enum RelationEnum {
    HAS_ONE = "HasOne",
    HAS_MANY = "HasMany"
}

declare class Field {
    model: typeof Model;
    key: string;
    type: any;
    relation?: RelationEnum;
    required: boolean;
    nullable: boolean;
    default?: any;
    validator: (value: any) => boolean;
    cast: any;
    mutator: (value: any) => any;
    constructor(key: string, field: any, model: typeof Model);
    private _boot;
    validate(value: any): true;
    make(value: unknown, model: Model): any;
}

declare type MutationHook<M extends Model = Model> = (context: {
    model: M;
    entity: string;
    [key: string]: any;
}) => void | false;
declare type HookableClosure = MutationHook;

interface SerializeOptions {
    /**
     * Whether the relationships should be serialized.
     * If set to `false`, only ID's will be included.
     */
    relations?: boolean;
    /**
     * Whether the serialization is for a request.
     */
    isRequest?: boolean;
    /**
     * Whether the request is a PATCH request.
     */
    shouldPatch?: boolean;
}

declare type ModelFields = Record<string, Field>;
declare type ModelSchemas = Record<string, ModelFields>;
declare type ModelRegistries = Record<string, ModelRegistry>;
declare type ModelRegistry = Record<string, () => Field>;
declare type ModelReference<T> = Readonly<Omit<T, keyof Model>>;
interface ModelOptions {
    /**
     * Whether this model should fill the given attributes on instantiate.
     */
    fill?: boolean;
    /**
     * Whether this model should fill relationships on instantiate.
     */
    relations?: boolean;
    /**
     * Whether this model should allow an existing identifier to be
     * overwritten on update.
     */
    overwriteIdentifier?: boolean;
    /**
     * Whether this model should perform a "patch" on update,
     * which will only send changed attributes in the request.
     */
    patch?: boolean;
    /**
     * Whether this model should save even if no attributes have changed
     * since the last time they were synced. If set to `false` and no
     * changes have been made, the request will be considered a success.
     */
    saveUnchanged?: boolean;
    /**
     * Allow custom options.
     */
    [key: string]: unknown;
}
declare class Model {
    /**
     * The name to be used for the model.
     */
    static entity: string;
    /**
     * The resource route of the model which is used to build the query.
     */
    static resource: string;
    /**
     * The primary key to be used for the model.
     */
    static primaryKey: string;
    /**
     * Attributes that should be read-only.
     * These attributes will be excluded from the payload when saving.
     */
    protected static readOnlyAttributes: string[];
    /**
     * The schema for the model. It contains the result of the `fields`
     * method or the attributes defined by decorators.
     */
    private static _schemas;
    /**
     * The registry for the model. It contains predefined model schema generated
     * by the property decorators and gets evaluated, and stored, on the `schema`
     * property when registering models to the database.
     */
    private static _registries;
    /**
     * The array of booted models.
     */
    private static _booted;
    /**
     * The global lifecycle hook registries.
     */
    private static _globalHooks;
    /**
     * The counter to generate the UID for global hooks.
     */
    private static _lastGlobalHookId;
    /**
     * Determines if the model is in saving state.
     */
    $saving: boolean;
    /**
     * Determines if the model is in deleting state.
     */
    $deleting: boolean;
    /**
     * Determines if the model is in fatal state.
     */
    $fatal: boolean;
    /**
     * The unique ID for the model.
     */
    readonly $uid: string;
    /**
     * The saved state of attributes.
     */
    readonly $: ModelReference<this>;
    /**
     * The local hook registries.
     */
    private _localHooks;
    /**
     * The counter to generate the UID for local hooks.
     */
    private _lastLocalHookId;
    /**
     * The collections of the record.
     */
    private readonly _collections;
    /**
     * The unmutated attributes of the record.
     */
    private readonly _attributes;
    /**
     * The unmutated relationships of the record.
     */
    private readonly _relationships;
    /**
     * The options of the record.
     */
    private readonly _options;
    /**
     * Create a new model instance.
     */
    constructor(attributes?: Element, collection?: Collection | Collection[] | null, options?: ModelOptions);
    /**
     * Get the model's ID.
     */
    get $id(): string | number | null;
    /**
     * Get the primary key for the model.
     */
    get $primaryKey(): string;
    /**
     * Determines whether the model has an ID.
     */
    get $hasId(): boolean;
    /**
     * Get the resource route of the model.
     */
    get $resource(): string;
    /**
     * Get the {@link entity} for this model.
     */
    get $entity(): string;
    get $collections(): Collection<this>[];
    /**
     * The options of the model.
     */
    static options(): ModelOptions;
    /**
     * The definition of the fields of the model and its relations.
     */
    static fields(): Record<string, any>;
    /**
     * Set the attribute to the registry.
     */
    static setRegistry(key: string, attribute: () => Field): typeof Model;
    /**
     * Clear the list of booted models so they can be re-booted.
     */
    static clearBootedModels(): void;
    /**
     * Clear registries.
     */
    static clearRegistries(): void;
    /**
     * Mutators to mutate matching fields when instantiating the model.
     */
    static mutators(): Mutators;
    /**
     * Get the {@link Model} schema definition from the {@link _schemas}.
     */
    static getFields(): ModelFields;
    /**
     * Check if the given key is the primary key.
     */
    static isPrimaryKey(key: string): boolean;
    /**
     * Get the id (value of primary key) from the given record. If primary key is
     * not present, or it is invalid primary key value, which is other than
     * `string` or `number`, it's going to return `null`.
     */
    static getIdFromRecord<M extends typeof Model>(this: M, record: InstanceType<M> | Element): string | number | null;
    /**
     * Get correct index id, which is `string` | `number`, from the given value.
     */
    static getIdFromValue(value: unknown): string | number | null;
    /**
     * @returns {*} A potential ID parsed from response data.
     */
    static parseId<T = unknown>(data: T): T;
    /**
     * Get the resource route of the model.
     */
    static getResource(): string;
    /**
     * Determines whether the record has an ID.
     */
    static hasId<M extends typeof Model>(this: M, record: InstanceType<M> | Element): boolean;
    /**
     * Determines whether the ID is valid.
     */
    static isValidId(value: unknown): value is string | number;
    /**
     * Fill any missing fields in the given record with the default value defined
     * in the model schema.
     */
    static hydrate(record?: Element): Element;
    /**
     * Determines whether the model has the given relationship.
     */
    static hasRelation(relationship: typeof Model): boolean;
    /**
     * Register a global hook. It will return ID for the hook that users may use
     * it to unregister hooks.
     */
    static on(on: string, callback: HookableClosure): number;
    /**
     * Unregister global hook with the given id.
     */
    static off(id: number): boolean;
    /**
     * Build the schema by evaluating fields and registry.
     */
    private static _initializeSchema;
    /**
     * Bootstrap this model.
     */
    private static _boot;
    /**
     * Build executable hook collection for the given hook.
     */
    private static _buildGlobalHooks;
    /**
     * Get global hook of the given name as array by stripping id key and keep
     * only hook functions.
     */
    private static _getGlobalHookAsArray;
    /**
     * Get the default options of the model.
     */
    private static _getDefaultOptions;
    /**
     * Get the constructor of this model.
     */
    $self(): typeof Model;
    /**
     * Registers a collection on this model. When this model is created it will
     * automatically be added to the collection. Similarly, when this model is
     * delete it will be remove from the collection. Registering the same
     * collection more than once has no effect.
     *
     * @param collection
     */
    $registerCollection(collection: Collection<this> | Collection<this>[]): void;
    /**
     * Removes a collection from this model's collection registry, removing all
     * effects that would occur when creating or deleting this model.
     *
     * Unregistering a collection that isn't registered has no effect.
     *
     * @param collection
     */
    $unregisterCollection(collection: Collection<this> | Collection<this>[]): void;
    /**
     * Set the model options.
     */
    $setOptions(options: ModelOptions): void;
    /**
     * Get the model options.
     */
    $getOptions(): ModelOptions;
    /**
     * Set a model's option.
     */
    $setOption<K extends keyof ModelOptions>(key: K, value: ValueOf<ModelOptions, K>): void;
    /**
     * Get a model's option.
     */
    $getOption<K extends keyof ModelOptions>(key: K, fallback?: ValueOf<ModelOptions, K>): ValueOf<ModelOptions, K>;
    /**
     * Get the model fields for this model.
     */
    $fields(): ModelFields;
    /**
     * Get a model field for this model.
     */
    $getField(attribute: string): Field;
    /**
     * Set the value of an attribute and registers the magic "getter". This method should always be
     * used when setting the value of an attribute.
     *
     * @returns The value that was set.
     */
    $set<T = any>(attribute: string | Record<string, any>, value?: T): T | undefined;
    /**
     * Return an attribute's value or a fallback value
     * if this model doesn't have the attribute.
     *
     * @returns The value of the attribute or `fallback` if not found.
     */
    $get(attribute: string, fallback?: unknown): any;
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
    $saved(attribute: string, fallback?: unknown): any;
    /**
     * Fill this model by the given attributes. Missing fields will be populated
     * by the attributes default value.
     */
    $fill(attributes?: Element, options?: ModelOptions): void;
    /**
     * Update this model by the given attributes.
     */
    $update(attributes?: Element | string | number | null | undefined, options?: ModelOptions): void;
    /**
     * Serialize given model POJO.
     */
    $serialize(options?: SerializeOptions): Element;
    /**
     * Get all of the current attributes on the model. This method is mainly used when saving a model.
     */
    $getAttributes(): Element;
    /**
     * Serialize this model, or the given model, as POJO.
     */
    $toJson(model?: Model, options?: SerializeOptions): Element;
    /**
     * Adds this model to all registered collections.
     */
    $addToAllCollections(): void;
    /**
     * Removes this model from all registered collections.
     */
    $removeFromAllCollections(): void;
    /**
     * Determine if the model or any of the given attribute(s) have been modified.
     */
    $isDirty(attributes?: string | string[]): boolean;
    /**
     * Determine if the model and all the given attribute(s) have remained the same.
     */
    $isClean(attributes?: string | string[]): boolean;
    /**
     * Determine if the model or any of the given attribute(s) have been modified.
     */
    $wasChanged(attributes?: string | string[]): boolean;
    $getDirty(): Record<string, any>;
    $getChanges(): Record<string, any>;
    /**
     * Sync the reference attributes with the current.
     */
    $syncReference(attributes?: string | string[]): this;
    /**
     * Sync the changed attributes.
     */
    $syncChanges(): this;
    /**
     * Reverts all attributes and relationships back to their defaults. This will also sync the reference
     * attributes and relationships, and is not reversible.
     */
    $clear(): void;
    /**
     * Reverts all attributes back to their defaults. This will also sync the reference
     * attributes, and is not reversible.
     */
    $clearAttributes(): void;
    /**
     * Resets model state, ie. `saving`, etc back to their initial states.
     */
    $clearState(): void;
    /**
     * Resets attributes back to their reference values (source of truth).
     * A good use case for this is when form fields are bound directly to the
     * model's attributes. Changing values in the form fields will change the
     * attributes on the model. On cancel, you can revert the model back to
     * its saved, original state using reset().
     *
     * It's also possible to pass an array of attributes to reset.
     */
    $reset(attributes?: string | string[]): void;
    /**
     * Returns whether this model should perform a "patch" on update, which will
     * only send changed data in the request, rather than all attributes.
     */
    $shouldPatch(): boolean;
    /**
     * Returns whether this model allows an existing identifier to be overwritten on update.
     */
    $shouldAllowIdentifierOverwrite(): boolean;
    /**
     * Execute mutation hooks to the given model.
     */
    $emit(event: string, context?: Record<string, any>): void | false;
    /**
     * Register a local hook. It will return ID for the hook that users may use
     * it to unregister hooks.
     */
    $on(on: string, callback: HookableClosure): number;
    /**
     * Unregister local hook with the given id.
     */
    $off(id: number): boolean;
    /**
     * Serialize this model as POJO.
     */
    protected toJSON(): Element;
    /**
     * Bootstrap this model.
     */
    private _boot;
    /**
     * Generate an unique ID for the model.
     */
    private _generateUid;
    /**
     * Register an attribute on this model so that it can be accessed directly
     * on the model, passing through `get` and `set`.
     */
    private _registerAttribute;
    /**
     * Register an attribute's reference on this model so that it can be accessed directly
     * on the model, passing through `get`.
     */
    private _registerReference;
    /**
     * Set an attribute in `{@link _attributes}` or {@link _relationships}, based on field type.
     */
    private _setAttribute;
    /**
     * Get an attribute from {@link _attributes} or {@link _relationships}, based on field type.
     *
     * @returns The unmutated value of attribute.
     */
    private _getAttribute;
    /**
     * Get all attributes from {@link _attributes} and {@link _relationships}.
     *
     * Do not confuse with the public method {@link $getAttributes},
     * which serializes the model and get all attributes without relationships.
     *
     * @returns The unmutated attributes.
     */
    private _getAttributes;
    /**
     * Get an attribute's reference from {@link _attributes} or {@link _relationships}, based on field type.
     *
     * @returns The unmutated value of attribute's reference.
     */
    private _getReference;
    /**
     * Get references of all attributes from {@link _attributes} and {@link _relationships}.
     *
     * @returns The unmutated references of attributes.
     */
    private _getReferences;
    /**
     * Get local hook of the given name as array by stripping id key and keep
     * only hook functions.
     */
    private _getLocalHookAsArray;
    /**
     * Build executable hook collection for the given hook.
     */
    private _buildLocalHooks;
    /**
     * Returns the default context for all events emitted by this instance.
     *
     * @returns {Object}
     */
    private _getDefaultEventContext;
}

declare class Relation<M extends Model = Model, D extends Item<M> | Collection<M> = Item<M> | Collection<M>, S extends boolean = boolean> {
    data: D;
    model: typeof Model;
    belongsToModel: Model;
    key: string;
    /**
     * If true, then this function will in all cases return a singular item. This is used by HasOne relation, which
     * when queried spawn a Builder with this property set to true.
     */
    forceSingular: boolean;
    constructor(model: typeof Model, belongsToModel: Model, data: D, key: string, forceSingular: S);
}

declare type HasMany<M extends Model = Model> = Relation<M, Collection<M>, false>;

declare type HasOne<M extends Model = Model> = Relation<M, Item<M>, true>;

type index_HasMany<_0> = HasMany<_0>;
type index_HasOne<_0> = HasOne<_0>;
type index_Relation<_0, _1, _2> = Relation<_0, _1, _2>;
declare const index_Relation: typeof Relation;
declare namespace index {
  export {
    index_HasMany as HasMany,
    index_HasOne as HasOne,
    index_Relation as Relation,
  };
}

interface PluginComponents {
    Model: typeof Model;
    Collection: typeof Collection;
    Relation: typeof Relation;
}
interface PluginOptions {
    [key: string]: any;
}
interface Plugin {
    [key: string]: any;
}
declare function use(plugin: Plugin, options?: PluginOptions): void;

/**
 * Model
 */

declare const _default: {
    use: typeof use;
    Model: typeof Model;
    Collection: typeof Collection;
    Relation: typeof Relation;
};

export default _default;
export { Collection, CollectionOptions, Element, Instance, Item, Model, ModelFields, ModelOptions, ModelReference, ModelRegistries, ModelRegistry, ModelSchemas, Plugin, PluginComponents, PluginOptions, index as Relations, use };
