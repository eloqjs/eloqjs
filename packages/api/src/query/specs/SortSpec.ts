export class SortSpec {
  public static parameter: string = 'sort'

  private readonly attribute: string

  private readonly positiveDirection: boolean

  public constructor(attribute: string, positiveDirection: boolean = true) {
    this.attribute = attribute
    this.positiveDirection = positiveDirection
  }

  public getAttribute(): string {
    return this.attribute
  }

  public getPositiveDirection(): boolean {
    return this.positiveDirection
  }

  public getValue(): string {
    return (!this.getPositiveDirection() ? '-' : '') + this.getAttribute()
  }
}
