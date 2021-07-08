import {
  capitalize,
  isNull,
  isNullish,
  isPlainObject,
  isString,
  isUndefined
} from '../support/Utils'
import { resolveCast } from './utils/cast'
import { resolveDefault } from './utils/default'
import { resolveNullable } from './utils/nullable'
import { resolveRequired } from './utils/required'
import { getName, resolveType, validateType } from './utils/type'
import { resolveValidator } from './utils/validator'

export class Field {
  public key: string
  public type: any
  public required: boolean = false
  public nullable: boolean = false
  public default?: any
  public validator: (value: any) => boolean = () => true
  public cast: any

  public constructor(key: string, field: any) {
    if (!isString(key)) {
      throw new Error('The field "key" must be an string.')
    }

    if (isNullish(field)) {
      throw new Error('The field is not defined.')
    }

    this.key = key

    this._boot(field)
  }

  private _boot(field: any) {
    if (!isPlainObject(field)) {
      this.type = field
      return
    }

    this.type = resolveType(this.key, field.type)
    this.required = resolveRequired(field.required)
    this.nullable = resolveNullable(field.nullable)
    this.default = resolveDefault(this.key, this.type, field.default)
    this.validator = resolveValidator(this.key, field.validator, this.validator)
    this.cast = resolveCast(this.key, this.type, field.cast)
  }

  public validate(value: any): true {
    // TODO: Improve `isUndefined` check to avoid duplicated code
    if (isUndefined(value)) {
      return true
    }

    if (!validateType(value, this.type) && !(isNull(value) && this.nullable)) {
      const typeName = getName(this.type)
      const valueName =
        (value && value.constructor && value.constructor.name) || isNull(value)
          ? 'Null'
          : capitalize(typeof value)

      throw new Error(
        `Invalid field: type check failed for field "${this.key}". Expected "${typeName}", got "${valueName}".`
      )
    }

    if (!this.validator(value)) {
      throw new Error(
        `Invalid field: custom validator check failed for field "${this.key}".`
      )
    }

    return true
  }

  public resolveValue(value: unknown): any {
    const nullish = this.nullable ? null : undefined
    const fallback = this.default ?? nullish

    value = !isUndefined(value) ? value : fallback

    if (this.cast && !isNullish(value)) {
      value = this.cast(value)
    }

    if (this.required && isNullish(value)) {
      throw new Error(`Missing required field: "${this.key}".`)
    }

    return this.validate(value) && value
  }
}
