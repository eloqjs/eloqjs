export type OptionValue = string | number | boolean

export class OptionSpec {
  private readonly _parameter: string

  private readonly _value: OptionValue

  public constructor(parameter: string, value: OptionValue) {
    this._parameter = parameter
    this._value = value
  }

  public getParameter(): string {
    return this._parameter
  }

  public getValue(): OptionValue {
    return this._value
  }
}
