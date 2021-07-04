export class SortSpec {
  public static parameter: string = 'sort'

  private readonly _attribute: string

  private readonly _positiveDirection?: boolean

  public constructor(attribute: string, positiveDirection?: boolean) {
    this._attribute = attribute
    this._positiveDirection = positiveDirection
  }

  public getAttribute(): string {
    return this._attribute
  }

  public getPositiveDirection(): boolean | undefined {
    return this._positiveDirection
  }

  public getValue(): string {
    const attribute = this.getAttribute()

    // Positive Direction
    // Remove negative operator prefix if the attribute have it
    if (this.getPositiveDirection() === true && attribute.startsWith('-')) {
      return attribute.substring(1)
    }

    // Negative Direction
    // Add negative operator prefix if the attribute doesn't have it already
    if (this.getPositiveDirection() === false && !attribute.startsWith('-')) {
      return `-${attribute}`
    }

    // The attribute already contains the direction, so we should not modify it
    return attribute
  }
}
