import { Model } from '../model/Model'
import { RelationEnum } from '../relations/RelationEnum'
import {
  isNull,
  isNullish,
  isPlainObject,
  isString,
  isUndefined
} from '../support/Utils'
import { resolveCast } from './utils/cast'
import { resolveDefault } from './utils/default'
import { resolveMutator } from './utils/mutator'
import { resolveNullable } from './utils/nullable'
import { resolveRelation, resolveRelationType } from './utils/relation'
import { resolveRequired } from './utils/required'
import {
  getExpectedName,
  getGottenName,
  resolveType,
  validateType
} from './utils/type'
import { resolveValidator } from './utils/validator'

export class Field {
  public model: typeof Model
  public key: string
  public type: any
  public relation?: RelationEnum
  public required: boolean = false
  public nullable: boolean = false
  public default?: any
  public validator: (value: any) => boolean = () => true
  public cast: any
  public mutator: (value: any) => any = (value: any) => value

  public constructor(key: string, field: any, model: typeof Model) {
    if (!isString(key)) {
      throw new Error('The field "key" must be an string.')
    }

    if (isNullish(field)) {
      throw new Error('The field is not defined.')
    }

    this.model = model
    this.key = key

    this._boot(field)
  }

  private _boot(field: any) {
    if (!isPlainObject(field)) {
      this.type = field
      return
    }

    this.type = resolveType({ key: this.key, type: field.type })
    this.relation = resolveRelationType({
      key: this.key,
      type: this.type,
      relation: field.relation as RelationEnum
    })
    this.required = resolveRequired({
      required: field.required
    })
    this.nullable = resolveNullable({
      nullable: this.relation ? true : field.nullable
    })
    this.default = resolveDefault({
      key: this.key,
      type: this.type,
      defaultValue: field.default
    })
    this.validator = resolveValidator({
      key: this.key,
      validator: field.validator,
      fallback: this.validator
    })
    this.mutator = resolveMutator({
      key: this.key,
      mutator: field.mutator || this.model.mutators()[this.key],
      fallback: this.mutator
    })
    this.cast = resolveCast({
      key: this.key,
      type: this.type,
      cast: this.relation ? true : field.cast
    })
  }

  public validate(value: any): true {
    if (this.required && isNullish(value)) {
      throw new Error(`Missing required field: "${this.key}".`)
    }

    // TODO: Improve `isUndefined` check to avoid duplicated code
    if (isUndefined(value)) {
      return true
    }

    if (
      !validateType(value, this.type, this.relation) &&
      !(isNull(value) && this.nullable)
    ) {
      const expectedName = getExpectedName(this.type, this.relation)
      const gottenName = getGottenName(value)

      throw new Error(
        `Invalid field: type check failed for field "${this.key}". Expected ${expectedName}, got ${gottenName}.`
      )
    }

    if (!this.validator(value)) {
      throw new Error(
        `Invalid field: custom validator check failed for field "${this.key}".`
      )
    }

    return true
  }

  public make(value: unknown, model: Model): any {
    const nullish = this.nullable ? null : undefined
    const fallback = this.default ?? nullish

    value = !isUndefined(value) ? value : fallback

    if (this.cast && !isNullish(value) && !this.relation) {
      value = this.cast(value)
    }

    if (this.mutator) {
      value = this.mutator(value)
    }

    const valid = this.validate(value)

    if (this.relation) {
      value = resolveRelation(model, this.type, this.relation, this.key, value)
    }

    return valid && value
  }
}
