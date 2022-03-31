import { ModelFields } from './FieldTypes'

export function defineFields<T extends ModelFields>(fields: T): T
export function defineFields<T1 extends ModelFields, T2 extends ModelFields>(fields: T1, baseFields: T2): T1 & T2
export function defineFields<T1 extends ModelFields, T2 extends ModelFields>(fields: T1, baseFields?: T2): T1 | (T1 & T2) {
  if (baseFields) {
    return {
      ...baseFields,
      ...fields
    }
  }

  return fields
}
