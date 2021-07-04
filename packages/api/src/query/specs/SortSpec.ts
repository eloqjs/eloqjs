export class SortSpec {
  public static parameter: string = 'sort'

  private readonly _attribute: string

  private readonly _positiveDirection: boolean

  public constructor(attribute: string, positiveDirection: boolean = true) {
    this._attribute = attribute
    this._positiveDirection = positiveDirection
  }

  public getAttribute(): string {
    return this._attribute
  }

  public getPositiveDirection(): boolean {
    return this._positiveDirection
  }

  public getValue(): string {
    const attribute = this.getAttribute()

    // Add negative operator prefix if the attribute doesn't have it already
    if (!this.getPositiveDirection() && !attribute.startsWith('-')) {
      return `-${attribute}`
    }

    return attribute
  }
}
