import { Model } from '../model/Model'

export type Element = Record<string, any>

export type Instance<M extends Model = Model> = M

export type Item<M extends Model = Model> = Instance<M> | null

export type Collection<M extends Model = Model> = Instance<M>[]
