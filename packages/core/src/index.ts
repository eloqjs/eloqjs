/**
 * Model
 */
export {
  Model,
  ModelFields,
  ModelOptions,
  ModelReference,
  ModelRegistries,
  ModelRegistry,
  ModelSchemas
} from './model/Model'

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
export { Collection, Element, Instance, Item } from './types/Data'

/**
 * Plugin
 */
export { Options, Plugin, PluginComponents, use } from './plugins/use'

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
