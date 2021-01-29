export class PageSpec {
  public static parameter: string = 'page'

  private readonly value: number

  public constructor(value: number) {
    this.value = value
  }

  public getValue(): number {
    return this.value
  }
}
