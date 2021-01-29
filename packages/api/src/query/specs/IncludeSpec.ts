export class IncludeSpec {
  public static parameter: string = 'include'

  private readonly value: string

  public constructor(value: string) {
    this.value = value
  }

  public getValue(): string {
    return this.value
  }
}
