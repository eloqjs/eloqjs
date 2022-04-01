import { MergeObject } from '../types/Utilities'
import { ModelFields } from './FieldTypes'

export function defineFields<T extends ModelFields>(fields: T): T
export function defineFields<T1 extends Partial<T2> & ModelFields, T2 extends ModelFields, R = MergeObject<T1, T2>>(
  fields: T1,
  baseFields: T2
): { [K in keyof R]: R[K] }
export function defineFields<T1 extends Partial<T2> & ModelFields, T2 extends ModelFields, R = MergeObject<T1, T2>>(
  fields: T1,
  baseFields?: T2
): T1 | { [K in keyof R]: R[K] } {
  if (baseFields) {
    return {
      ...baseFields,
      ...fields
    }
  }

  return fields
}
