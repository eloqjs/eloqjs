export class AppendSpec {
  public static parameter: string = 'append'

  private readonly value: string

  public constructor(value: string) {
    this.value = value
  }

  public getValue(): string {
    return this.value
  }
}
