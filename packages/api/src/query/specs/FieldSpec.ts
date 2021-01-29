export class FieldSpec {
  public static parameter: string = 'fields'

  private readonly attribute: string

  private readonly value: string

  public constructor(attribute: string, value: string) {
    this.attribute = attribute
    this.value = value
  }

  public getParameter(): string {
    return `${FieldSpec.parameter}[${this.getAttribute()}]`
  }

  public getAttribute(): string {
    return this.attribute
  }

  public getValue(): string {
    return this.value
  }
}
