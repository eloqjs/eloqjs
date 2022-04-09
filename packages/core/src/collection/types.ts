import { Model, SerializedModel } from '../model'

export interface CollectionOptions {
  model?: typeof Model
}

export interface SerializeCollectionOptions {
  /**
   * Whether the relationships should be serialized.
   */
  relations?: boolean
}

export interface SerializedCollection {
  options: CollectionOptions
  models: SerializedModel[]
}

export interface CloneCollectionOptions {
  /**
   * Whether it should clone deeply. This will clone models.
   */
  deep?: boolean

  /**
   * Level 1 clone models.
   * Level 2 deep clone models.
   */
  deepLevel?: 1 | 2
}
