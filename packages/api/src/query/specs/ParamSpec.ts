import { forceArray } from '../../support/Utils'

export type ParamValue = any

export class ParamSpec {
  private readonly _parameter: string | string[]

  private readonly _value: ParamValue

  public constructor(parameter: string | string[], value: ParamValue) {
    this._parameter = parameter
    this._value = value
  }

  public getParameter(): string {
    const attributes = [...forceArray(this._parameter)]
    let parameter = attributes.shift() || ''

    for (const attribute of attributes) {
      parameter += `[${attribute}]`
    }

    return parameter
  }

  public getValue(): ParamValue {
    return this._value
  }
}
