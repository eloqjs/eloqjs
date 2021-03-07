export class FieldSpec {
  public static parameter: string = 'fields'

  private readonly _attribute: string

  private readonly _value: string

  public constructor(attribute: string, value: string) {
    this._attribute = attribute
    this._value = value
  }

  public getParameter(): string {
    return `${FieldSpec.parameter}[${this.getAttribute()}]`
  }

  public getAttribute(): string {
    return this._attribute
  }

  public getValue(): string {
    return this._value
  }
}
