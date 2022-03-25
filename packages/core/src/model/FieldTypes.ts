import * as Relations from '../relations'
import { Data } from '../types/Data'
import { DeepPartial, IfAny } from '../types/Utilities'
import { Model } from './Model'

export type DefaultFactory<T> = () => T | null | undefined

export type FieldMethod<T, TConstructor = any> = [T] extends [((...args: any) => any) | undefined]
  ? // if is function with args, allowing non-required functions
    { new (): TConstructor; (): T; readonly prototype: TConstructor } // Create Function like constructor
  : never

// eslint-disable-next-line @typescript-eslint/ban-types
export type FieldConstructor<T = any> = { new (...args: any[]): T & {} } | { (): T } | FieldMethod<T>

export type FieldType<T> = FieldConstructor<T> | FieldConstructor<T>[]

export interface FieldOptions<T = any, D = T> {
  type?: FieldType<T> | true | null
  relation?: 'HasOne' | 'HasMany'
  cast?: boolean
  nullable?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object

  validator?(value: unknown): boolean

  mutator?(value: unknown): boolean
}

export type ModelField<T, D = T> = FieldOptions<T, D> | FieldType<T>

export type ModelFields<P = Data> = {
  [K in keyof P]: ModelField<P[K]> | null
}

export type InferFieldType<T> = [T] extends [null]
  ? any // null & true would fail to infer
  : [T] extends [{ type: null | true }]
  ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when
  : // inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with
  // PropMethod) becomes `Boolean`
  [T] extends [ObjectConstructor | { type: ObjectConstructor }]
  ? Record<string, any>
  : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
  ? boolean
  : [T] extends [DateConstructor | { type: DateConstructor }]
  ? Date
  : [T] extends [{ type: infer U }]
  ? U extends typeof Model
    ? [T] extends [{ relation: 'HasOne' }]
      ? U
      : [T] extends [{ relation: 'HasMany' }]
      ? U[]
      : InferFieldType<U>
    : InferFieldType<U>
  : [T] extends [(infer U)[] | { type: (infer U)[] }]
  ? U extends DateConstructor
    ? Date | InferFieldType<U>
    : InferFieldType<U>
  : [T] extends [ModelField<infer V, infer D>]
  ? unknown extends V
    ? IfAny<V, V, D>
    : V
  : T

export type InferNullableField<T> = [T] extends [{ nullable: true }] ? null : never

export type ExtractModelFields<T extends typeof Model> = ReturnType<T['fields']>
export type ExtractModelFieldsTypes<T extends typeof Model, O = ExtractModelFields<T>> = {
  [K in string & keyof O]: InferFieldType<O[K]> | InferNullableField<O[K]>
}

export type ModelInput<T extends typeof Model, O = ExtractModelFieldsTypes<T>> = {
  [K in keyof O]?:
    | (O[K] extends typeof Model
        ? InstanceType<O[K]> | ModelInput<O[K]> | null
        : O[K] extends (infer U)[]
        ? U extends typeof Model
          ? (InstanceType<U> | ModelInput<U>)[]
          : DeepPartial<U[]>
        : DeepPartial<O[K]>)
    | InferNullableField<O[K]>
}

export type ModelProperties<T extends typeof Model, O = ExtractModelFieldsTypes<T>> = {
  [K in keyof O]:
    | (O[K] extends typeof Model
        ? Relations.HasOne<InstanceType<O[K]>>
        : O[K] extends (infer U)[]
        ? U extends typeof Model
          ? Relations.HasMany<InstanceType<U>>
          : O[K]
        : O[K])
    | InferNullableField<O[K]>
}

export type ModelKeys<T extends typeof Model> = keyof ModelInput<T>

export type ModelAttributes<T extends typeof Model, R extends boolean = true, O = ExtractModelFieldsTypes<T>> = {
  [K in keyof O]:
    | (O[K] extends typeof Model
        ? R extends true
          ? InstanceType<O[K]> | ModelAttributes<O[K]> | null
          : never
        : O[K] extends (infer U)[]
        ? U extends typeof Model
          ? R extends true
            ? (InstanceType<U> | ModelAttributes<U> | null)[]
            : never
          : U[]
        : O[K])
    | InferNullableField<O[K]>
}
