import { Model } from '../model'
import * as Relations from '../relations'
import { Data } from './data'
import { IfAny, MergeObject } from './utilities'

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
  cast?: true | FieldType<T> | ((value: any) => any)
  nullable?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object

  validator?(value: unknown): boolean

  accessor?(value: unknown): unknown

  mutator?(value: unknown): unknown
}

export type ModelField<T, D = T> = FieldOptions<T, D> | FieldType<T> | FieldType<T>[]

export type ModelFields<P = Data> = {
  [K in keyof P]: ModelField<P[K]>
}

/**
 * Merge the defined field options with the default field option types, so we have full intellisense
 */
export type ResolveFields<T> = {
  [K in keyof T]?: T[K] extends { type: any } ? MergeObject<T[K], FieldOptions<T[K]>> : T[K]
}

export type FieldTypeValue<T> = T | { type: T }
export type FieldCastValue<T> = { cast: T }
export type FieldDefaultValue<T> = { default: T }
export type FieldAccessorValue<T> = { accessor: (...args: any[]) => T }
export type HasOneRelation<T extends typeof Model> = { type: T; relation: 'HasOne' }
export type HasManyRelation<T extends typeof Model> = { type: T; relation: 'HasMany' }
export type NullableField = { nullable: true }

export type ExtractModelFields<T extends typeof Model> = ReturnType<T['fields']>
export type ExtractModelAccessors<T extends typeof Model> = ReturnType<T['accessors']>
export type ExtractAccessorType<A, K> = K extends keyof A ? A[K] : undefined

export type InferFieldType<T> = [T] extends [FieldTypeValue<null | true>]
  ? any // null & true would fail to infer
  : // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 somehow `ObjectConstructor` when
  // inferred from { (): T } becomes `any
  // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
  [T] extends [FieldTypeValue<ObjectConstructor>]
  ? Record<string, any>
  : [T] extends [FieldTypeValue<BooleanConstructor>]
  ? boolean
  : [T] extends [FieldTypeValue<DateConstructor>]
  ? Date
  : [T] extends [FieldTypeValue<readonly (infer U)[]>]
  ? U extends DateConstructor
    ? Date | InferFieldType<U>
    : InferFieldType<U>
  : [T] extends [ModelField<infer V, infer D>]
  ? unknown extends V
    ? IfAny<V, V, D>
    : V
  : T

export type InferFieldCast<T, D = any> = [T] extends [FieldCastValue<ObjectConstructor>]
  ? Record<string, any> // Cast to object
  : [T] extends [FieldCastValue<BooleanConstructor>]
  ? boolean // Cast to boolean
  : [T] extends [FieldCastValue<DateConstructor>]
  ? Date // Cast to date
  : [T] extends [FieldCastValue<(...args: any[]) => infer C>]
  ? C // If cast is a function, use its return type
  : [T] extends [FieldCastValue<new (...args: any[]) => infer C>]
  ? C // If cast is a class, use its return type
  : D // If cast is true, use field type

export type InferFieldCastOrType<T> = [T] extends [FieldCastValue<any>] ? InferFieldCast<T, InferFieldType<T>> : InferFieldType<T>

export type InferFieldAccessorOrCastOrType<T> = [T] extends [FieldAccessorValue<infer U>]
  ? U // Accessor defined in field options
  : [T] extends [FieldCastValue<any>]
  ? InferFieldCast<T, InferFieldType<T>> // Cast type
  : InferFieldType<T> // Field type

export type InferNullishField<T> = T extends NullableField
  ? null // Nullable field
  : T extends
      | FieldDefaultValue<any>
      // don't mark Boolean fields as undefined
      | FieldTypeValue<BooleanConstructor>
  ? T extends FieldDefaultValue<undefined | (() => undefined)>
    ? undefined // If the default is undefined, mark as undefined
    : never // Otherwise, field is required
  : undefined // Non-nullable field

export type ModelInput<T extends typeof Model, O = ExtractModelFields<T>> = {
  [K in string & keyof O]?: [O[K]] extends [HasOneRelation<infer U>]
    ? InstanceType<U> | ModelInput<U> | null // HasOne relation
    : [O[K]] extends [HasManyRelation<infer U>]
    ? (InstanceType<U> | ModelInput<U>)[] // HasMany relation
    : InferFieldType<O[K]> | InferNullishField<O[K]>
}

export type ModelProperties<T extends typeof Model, O = ExtractModelFields<T>> = {
  [K in string & keyof O]: [O[K]] extends [HasOneRelation<infer U>]
    ? Relations.HasOne<InstanceType<U>> // HasOne relation
    : [O[K]] extends [HasManyRelation<infer U>]
    ? Relations.HasMany<InstanceType<U>> // HasMany relation
    : InferFieldAccessorOrCastOrType<O[K]> | InferNullishField<O[K]>
}

export type ModelKeys<T extends typeof Model> = keyof ModelAttributes<T>

export type ModelAttributes<T extends typeof Model, R extends boolean = true, O = ExtractModelFields<T>> = {
  [K in string & keyof O]: [O[K]] extends [HasOneRelation<infer U>]
    ? R extends true
      ? ModelAttributes<U, R> | null // HasOne relation
      : never // Relations are disabled
    : [O[K]] extends [HasManyRelation<infer U>]
    ? R extends true
      ? ModelAttributes<U, R>[] // HasMany relation
      : never // Relations are disabled
    : InferFieldCastOrType<O[K]> | InferNullishField<O[K]>
}
