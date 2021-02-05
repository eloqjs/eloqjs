import { Model } from './Model'

export type MutationHook<M extends Model = Model> = (
  model: M | null,
  entity: string
) => void

export type HookableClosure = MutationHook

export interface GlobalHook {
  id: number
  callback: HookableClosure
}

export interface GlobalHooks {
  [on: string]: GlobalHook[]
}
