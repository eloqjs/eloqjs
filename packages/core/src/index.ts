/**
 * Model
 */
export type {
  Accessor,
  Accessors,
  GlobalHook,
  GlobalHooks,
  HookableClosure,
  LocalHook,
  LocalHooks,
  MutationHook,
  Mutator,
  Mutators
} from './model/Contracts'
export { defineFields } from './model/DefineFields'
export type {
  DefaultFactory,
  ExtractModelFields,
  FieldAccessorValue,
  FieldCastValue,
  FieldDefaultValue,
  FieldMethod,
  FieldOptions,
  FieldType,
  FieldTypeValue,
  HasManyRelation,
  HasOneRelation,
  InferFieldAccessorOrCastOrType,
  InferFieldCast,
  InferFieldCastOrType,
  InferFieldType,
  InferNullishField,
  ModelAttributes,
  ModelField,
  ModelFields,
  ModelInput,
  ModelKeys,
  ModelProperties,
  NullableField,
  ResolveFields
} from './model/FieldTypes'
export type {
  CloneModelOptions,
  Fields,
  GetModelAttributesOptions,
  ModelOptions,
  ModelReference,
  ModelRegistries,
  ModelRegistry,
  ModelSchemas
} from './model/Model'
export { Model } from './model/Model'
export type { SerializedModel, SerializeModelOptions } from './model/Serialize'

/**
 * Collection
 */
export type { CloneCollectionOptions, CollectionOptions, SerializeCollectionOptions, SerializedCollection } from './collection/Collection'
export { Collection } from './collection/Collection'

/**
 * Relationships
 */
export * as Relations from './relations'

/**
 * Types
 */
export type { Element, Instance, Item } from './types/Data'

/**
 * Plugin
 */
export type { Plugin, PluginComponents, PluginOptions, use } from './plugins/use'

/**
 * ELOQJS (Default)
 */
import { Collection } from './collection/Collection'
import { Model } from './model/Model'
import { use } from './plugins/use'
import { Relation } from './relations'

export default {
  use,
  Model,
  Collection,
  Relation
}
