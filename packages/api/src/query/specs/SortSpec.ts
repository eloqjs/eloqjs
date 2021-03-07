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
    return (!this.getPositiveDirection() ? '-' : '') + this.getAttribute()
  }
}
