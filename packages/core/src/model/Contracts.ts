import { Model } from './Model'

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
