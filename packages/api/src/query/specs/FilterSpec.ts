import { forceArray } from '../../support/Utils'

export type FilterValue = string | number | boolean

export class FilterSpec {
  public static parameter: string = 'filter'

  private readonly _attribute: string | string[]

  private readonly _value: FilterValue

  public constructor(attribute: string | string[], value: FilterValue) {
    this._attribute = attribute
    this._value = value
  }

  public getParameter(): string {
    const attributes = forceArray(this.getAttribute())
    let parameter = FilterSpec.parameter

    for (const attribute of attributes) {
      parameter += `[${attribute}]`
    }

    return parameter
  }

  public getAttribute(): string | string[] {
    return this._attribute
  }

  public getValue(): FilterValue {
    return this._value
  }
}
