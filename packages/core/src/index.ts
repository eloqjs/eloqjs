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
import { Model } from './model/Model'
import { use } from './plugins/use'

export default {
  use,
  Model
}
