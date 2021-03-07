export class Map<T> {
  protected data: { [key: string]: T } = {}
  protected reference: { [key: string]: T } = {}
  protected modified: string[] = []

  public get(key: string): T {
    return this.data[key]
  }

  public set(key: string, value: T): void {
    this._setReference(key, value)
    this._setData(key, value)
  }

  public $get(key: string): T {
    return this.reference[key]
  }

  public toArray(): { [key: string]: T } {
    return this.data
  }

  public $toArray(): { [key: string]: T } {
    return this.reference
  }

  public diff(): { [key: string]: T } {
    const diff = {}

    for (const key of this.modified) {
      diff[key] = this.data[key]
    }

    return diff
  }

  public isModified(key: string): boolean {
    return this.modified.includes(key)
  }

  private _setData(key: string, value: T): void {
    this.data[key] = value
  }

  private _setReference(key: string, value: T): void {
    if (!(key in this.reference)) {
      this.reference[key] = value
    } else if (!this.modified.includes(key)) {
      this.modified.push(key)
    }
  }
}
