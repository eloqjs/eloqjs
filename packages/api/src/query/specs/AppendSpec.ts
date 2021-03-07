export class AppendSpec {
  public static parameter: string = 'append'

  private readonly _value: string

  public constructor(value: string) {
    this._value = value
  }

  public getValue(): string {
    return this._value
  }
}
