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
export * from './relations'

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
import { use } from './plugins/use'

export default {
  use
}
