/**
 * Model
 */
export * from './model'

/**
 * Collection
 */
export * from './collection'

/**
 * Relationships
 */
export * as Relations from './relations'

/**
 * Types
 */
export * from './types'

/**
 * Plugin
 */
export * from './plugins/use'

/**
 * ELOQJS (Default)
 */
import { Collection } from './collection'
import { Model } from './model'
import { use } from './plugins/use'
import { Relation } from './relations'

export default {
  use,
  Model,
  Collection,
  Relation
}
