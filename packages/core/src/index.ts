/**
 * Model
 */
export type {
  Accessor,
  Accessors,
  Attributes,
  AttributesData,
  GlobalHook,
  GlobalHooks,
  HookableClosure,
  LocalHook,
  LocalHooks,
  MutationHook,
  Mutator,
  Mutators,
  SerializedModel,
  SerializeModelOptions
} from './model'
export { DefaultAttributes, defineFields, Field, Model } from './model'

/**
 * Collection
 */
export { Collection } from './collection/collection'

/**
 * Relationships
 */
export * as Relations from './relations'

/**
 * Types
 */
export type {
  Data,
  DefaultFactory,
  Element,
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
  Instance,
  Item,
  ModelAttributes,
  ModelField,
  ModelFields,
  ModelInput,
  ModelKeys,
  ModelProperties,
  NullableField,
  ResolveFields
} from './types'

/**
 * Plugin
 */
export type { CloneCollectionOptions, CollectionOptions, SerializeCollectionOptions, SerializedCollection } from './collection'
export type {
  CloneModelOptions,
  Fields,
  GetModelAttributesOptions,
  ModelOptions,
  ModelReference,
  ModelRegistries,
  ModelRegistry,
  ModelSchemas
} from './model'
export type { Plugin, PluginComponents, PluginOptions, use } from './plugins/use'

/**
 * ELOQJS (Default)
 */
import { Collection } from './collection/collection'
import { Model } from './model/model'
import { use } from './plugins/use'
import { Relation } from './relations'

export default {
  use,
  Model,
  Collection,
  Relation
}
