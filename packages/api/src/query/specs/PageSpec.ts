export class PageSpec {
  public static parameter: string = 'page'

  private readonly _value: number

  public constructor(value: number) {
    this._value = value
  }

  public getValue(): number {
    return this._value
  }
}
