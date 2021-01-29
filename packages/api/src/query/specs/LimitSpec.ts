export class LimitSpec {
  public static parameter: string = 'limit'

  private readonly value: number

  public constructor(value: number) {
    this.value = value
  }

  public getValue(): number {
    return this.value
  }
}
