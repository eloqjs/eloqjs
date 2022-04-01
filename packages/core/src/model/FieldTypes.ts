import * as Relations from '../relations'
import { Data } from '../types/Data'
import { IfAny, MergeObject } from '../types/Utilities'
import { Model } from './Model'

export type DefaultFactory<T> = () => T | null | undefined

export type FieldMethod<T, TConstructor = any> = [T] extends [((...args: any) => any) | undefined]
  ? // if is function with args, allowing non-required functions
    { new (): TConstructor; (): T; readonly prototype: TConstructor } // Create Function like constructor
  : never

// eslint-disable-next-line @typescript-eslint/ban-types
export type FieldType<T = any> = { new (...args: any[]): T & {} } | { (): T } | FieldMethod<T>

export interface FieldOptions<T = any, D = T> {
  type: FieldType<T> | FieldType<T>[]
  relation?: 'HasOne' | 'HasMany'
  cast?: true | FieldType<T> | ((value: unknown) => unknown)
  nullable?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object

  validator?(value: unknown): boolean

  mutator?(value: unknown): unknown
}

export type ModelField<T, D = T> = FieldOptions<T, D> | FieldType<T> | FieldType<T>[]

export type ModelFields<P = Data> = {
  [K in keyof P]: ModelField<P[K]>
}

export type ResolveFields<T> = {
  [K in keyof T]?: T[K] extends { type: any } ? MergeObject<T[K], FieldOptions<T[K]>> : T[K]
}

export type InferFieldType<T> = [T] extends [null]
  ? any // null & true would fail to infer
  : [T] extends [{ type: null | true }]
  ? any
  : // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 somehow `ObjectConstructor` when
  // inferred from { (): T } becomes `any
  // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
  [T] extends [ObjectConstructor | { type: ObjectConstructor }]
  ? Record<string, any>
  : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
  ? boolean
  : [T] extends [DateConstructor | { type: DateConstructor }]
  ? Date
  : // Check for readonly array since we use "as const"
  [T] extends [readonly (infer U)[] | { type: readonly (infer U)[] }]
  ? U extends DateConstructor
    ? Date | InferFieldType<U>
    : InferFieldType<U>
  : [T] extends [ModelField<infer V, infer D>]
  ? unknown extends V
    ? IfAny<V, V, D>
    : V
  : T

export type InferFieldTypeOrCast<T> = [T] extends [{ cast: ObjectConstructor }]
  ? Record<string, any> // Cast to object
  : [T] extends [{ cast: BooleanConstructor }]
  ? boolean // Cast to boolean
  : [T] extends [{ cast: DateConstructor }]
  ? Date // Cast to date
  : [T] extends [{ cast: (...args: any[]) => infer C }]
  ? C // If cast is a function, use its return type
  : [T] extends [{ cast: new (...args: any[]) => infer C }]
  ? C // If cast is a class, use its return type
  : InferFieldType<T> // If not casting, infer field type

export type InferNullishField<T> = T extends { nullable: true }
  ? null
  : T extends
      | { default: any }
      // don't mark Boolean fields as undefined
      | BooleanConstructor
      | { type: BooleanConstructor }
      // don't mark Relation fields as undefined
      | { type: typeof Model }
  ? T extends { default: undefined | (() => undefined) }
    ? undefined
    : never
  : undefined

export type ExtractModelFields<T extends typeof Model> = ReturnType<T['fields']>

export type ExtractFieldTypes<T> = InferFieldType<T> | InferNullishField<T>

export type ModelInput<T extends typeof Model, O = ExtractModelFields<T>> = {
  [K in string & keyof O]?: O[K] extends { type: typeof Model }
    ? // It's needed to check for typeof Model before inferring the type to avoid double "else" for other field types
      O[K] extends { type: infer U }
      ? U extends typeof Model // We check again so type of "U" is not lost
        ? [O[K]] extends [{ relation: 'HasOne' }]
          ? InstanceType<U> | ModelInput<U> | null // HasOne relation
          : [O[K]] extends [{ relation: 'HasMany' }]
          ? (InstanceType<U> | ModelInput<U>)[] // HasMany relation
          : never // Wrong relation type
        : never // Will never reach here
      : never // Will never reach here
    : InferFieldType<O[K]> | InferNullishField<O[K]>
}

export type ModelProperties<T extends typeof Model, O = ExtractModelFields<T>> = {
  [K in string & keyof O]: O[K] extends { type: typeof Model }
    ? // It's needed to check for typeof Model before inferring the type to avoid double "else" for other field types
      O[K] extends { type: infer U }
      ? U extends typeof Model // We check again so type of "U" is not lost
        ? [O[K]] extends [{ relation: 'HasOne' }]
          ? Relations.HasOne<InstanceType<U>> // HasOne relation
          : [O[K]] extends [{ relation: 'HasMany' }]
          ? Relations.HasMany<InstanceType<U>> // HasMany relation
          : never // Wrong relation type
        : never // Will never reach here
      : never // Will never reach here
    : InferFieldTypeOrCast<O[K]> | InferNullishField<O[K]>
}

export type ModelKeys<T extends typeof Model> = keyof ModelAttributes<T>

export type ModelAttributes<T extends typeof Model, R extends boolean = true, O = ExtractModelFields<T>> = {
  [K in string & keyof O]: O[K] extends { type: typeof Model }
    ? R extends true
      ? // It's needed to check for typeof Model before inferring the type to avoid double "else" for other field types
        O[K] extends { type: infer U }
        ? U extends typeof Model // We check again so type of "U" is not lost
          ? [O[K]] extends [{ relation: 'HasOne' }]
            ? ModelAttributes<U, R> | null // HasOne relation
            : [O[K]] extends [{ relation: 'HasMany' }]
            ? ModelAttributes<U, R>[] // HasMany relation
            : never // Wrong relation type
          : never // Will never reach here
        : never // Will never reach here
      : never // Relations are disabled
    : InferFieldTypeOrCast<O[K]> | InferNullishField<O[K]>
}
