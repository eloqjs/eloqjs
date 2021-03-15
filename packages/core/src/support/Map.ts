export class Map<T> {
  protected data: Record<string, T> = {}

  public get(key: string): T {
    return this.data[key]
  }

  public set(key: string, value: T): void {
    this.data[key] = value
  }

  public delete(key: string): void {
    delete this.data[key]
  }

  public toArray(): Record<string, T> {
    return this.data
  }
}
