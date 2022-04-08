import { Attributes, AttributesData } from './Attributes'

export class DefaultAttributes implements Attributes {
  protected data: AttributesData = {}

  public constructor(attributes: AttributesData = {}) {
    this.setAll(attributes)
  }

  public get(key: string): any {
    return this.data[key]
  }

  public set(key: string, value: unknown): void {
    this.data[key] = value
  }

  public has(key: string): boolean {
    return key in this.data
  }

  public delete(key: string): void {
    delete this.data[key]
  }

  public getAll(): AttributesData {
    return this.data
  }

  public setAll(attributes: AttributesData): void {
    Object.assign(this.data, attributes)
  }

  public clear(): void {
    for (const key in this.data) {
      delete this.data[key]
    }
  }

  public replace(attributes: AttributesData): void {
    this.clear()
    this.setAll(attributes)
  }

  public clone(): Attributes {
    return new DefaultAttributes(this.data)
  }
}
