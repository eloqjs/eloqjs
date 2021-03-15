import { Map } from './Map'

export class AttrMap<T> extends Map<T> {
  protected reference: Record<string, T> = {}
  protected modified: string[] = []

  public set(key: string, value: T): void {
    this._setReference(key, value)
    super.set(key, value)
  }

  public isModified(key: string): boolean {
    return this.modified.includes(key)
  }

  public $get(key: string): T {
    return this.reference[key]
  }

  public $toArray(): Record<string, T> {
    return this.reference
  }

  private _setReference(key: string, value: T): void {
    if (!(key in this.reference)) {
      this.reference[key] = value
    } else if (!this.modified.includes(key)) {
      this.modified.push(key)
    }
  }
}
