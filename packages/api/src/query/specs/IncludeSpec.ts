export class IncludeSpec {
  public static parameter: string = 'include'

  private readonly _value: string

  public constructor(value: string) {
    this._value = value
  }

  public getValue(): string {
    return this._value
  }
}
