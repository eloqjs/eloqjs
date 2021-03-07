export class LimitSpec {
  public static parameter: string = 'limit'

  private readonly _value: number

  public constructor(value: number) {
    this._value = value
  }

  public getValue(): number {
    return this._value
  }
}
