import { Field } from './field/field'
import { Model } from './model'

export type MutationHook<M extends Model = Model> = (context: { model: M; entity: string; [key: string]: any }) => void | false

export type HookableClosure = MutationHook

export interface GlobalHook {
  id: number
  callback: HookableClosure
}

export interface LocalHook {
  id: number
  callback: HookableClosure
}

export interface GlobalHooks {
  [on: string]: GlobalHook[]
}

export interface LocalHooks {
  [on: string]: LocalHook[]
}

export type Mutator<T> = (value: T) => T

export type Mutators = Record<string, Mutator<any>>

export type Accessor<T> = (value: T) => T

export type Accessors = Record<string, Accessor<any>>
export type Fields = Record<string, Field>
export type ModelSchemas = Record<string, Fields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Field>
export type ModelReference<T> = Readonly<Omit<T, keyof Model>>

export interface ModelOptions {
  /**
   * Whether this model should fill relationships on instantiate.
   */
  relations?: boolean

  /**
   * Whether this model should allow an existing identifier to be
   * overwritten on update.
   */
  overwriteIdentifier?: boolean

  /**
   * Whether this model should perform a "patch" on update,
   * which will only send changed attributes in the request.
   */
  patch?: boolean

  /**
   * Whether this model should save even if no attributes have changed
   * since the last time they were synced. If set to `false` and no
   * changes have been made, the request will be considered a success.
   */
  saveUnchanged?: boolean

  /**
   * Allow custom options.
   */
  [key: string]: unknown
}

export interface GetModelAttributesOptions {
  /**
   * Whether the relationships should be serialized.
   */
  relations?: boolean

  /**
   * Whether the serialization is for a request.
   */
  isRequest?: boolean

  /**
   * Whether the request is a PATCH request.
   */
  shouldPatch?: boolean
}

export interface CloneModelOptions {
  /**
   * Whether it should clone deeply. This will clone relationships too.
   */
  deep?: boolean
}
