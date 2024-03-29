import { Model } from '../model'

export type Element = Record<string, any>

export type Instance<M extends Model = Model> = M

export type Item<M extends Model = Model> = Instance<M> | null

export type Data = Record<string, unknown>
