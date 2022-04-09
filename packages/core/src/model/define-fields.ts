import { ModelFields, ResolveFields } from '../types'
import { MergeObject } from '../types/utilities'

export function defineFields<T extends ModelFields>(fields: T): T
export function defineFields<T1 extends ResolveFields<T2> & ModelFields, T2 extends ModelFields>(
  fields: T1,
  baseFields: T2
): MergeObject<T1, T2>
export function defineFields<T1 extends ResolveFields<T2> & ModelFields, T2 extends ModelFields>(
  fields: T1,
  baseFields?: T2
): T1 | MergeObject<T1, T2> {
  if (baseFields) {
    return {
      ...baseFields,
      ...fields
    }
  }

  return fields
}
