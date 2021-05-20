/**
 * Model
 */
export type {
  ModelFields,
  ModelOptions,
  ModelReference,
  ModelRegistries,
  ModelRegistry,
  ModelSchemas
} from './model/Model'
export { Model } from './model/Model'

/**
 * Collection
 */
export type { CollectionOptions } from './collection/Collection'
export { Collection } from './collection/Collection'

/**
 * Attributes
 */
export * as Attributes from './attributes'

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
export type { Options, Plugin, PluginComponents, use } from './plugins/use'

/**
 * ELOQJS (Default)
 */
import {
  Attr,
  Attribute,
  Boolean,
  HasMany,
  HasOne,
  Number,
  Relation,
  String,
  Type
} from './attributes'
import { Model } from './model/Model'
import { use } from './plugins/use'

export default {
  use,
  Model,
  Attribute,
  Type,
  Attr,
  String,
  Number,
  Boolean,
  Relation,
  HasOne,
  HasMany
}
