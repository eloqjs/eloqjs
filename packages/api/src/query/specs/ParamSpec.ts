export type ParamValue = string | number | boolean

export class ParamSpec {
  private readonly _parameter: string

  private readonly _value: ParamValue

  public constructor(parameter: string, value: ParamValue) {
    this._parameter = parameter
    this._value = value
  }

  public getParameter(): string {
    return this._parameter
  }

  public getValue(): ParamValue {
    return this._value
  }
}
