import { forceArray } from '../../support/Utils'

export type FilterValue = string | number | boolean

export class FilterSpec {
  public static parameter: string = 'filter'

  private readonly attribute: string | string[]

  private readonly value: FilterValue

  public constructor(attribute: string | string[], value: FilterValue) {
    this.attribute = attribute
    this.value = value
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
    return this.attribute
  }

  public getValue(): FilterValue {
    return this.value
  }
}
