export type OptionValue = string | number | boolean

export class OptionSpec {
  private readonly parameter: string

  private readonly value: OptionValue

  public constructor(parameter: string, value: OptionValue) {
    this.parameter = parameter
    this.value = value
  }

  public getParameter(): string {
    return this.parameter
  }

  public getValue(): OptionValue {
    return this.value
  }
}
