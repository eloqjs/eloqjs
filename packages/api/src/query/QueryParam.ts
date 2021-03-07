export class QueryParam {
  private readonly _name: string

  private readonly _value: unknown

  public constructor(name: string, value: unknown = null) {
    this._name = name
    this._value = value
  }

  /**
   * The name of the query parameter.
   */
  public get name(): string {
    return this._name
  }

  /**
   * The value of the query parameter.
   */
  public get value(): any {
    return this._value
  }

  /**
   * Encodes the query parameter.
   */
  public encode(): string {
    return (
      QueryParam._encodeURI(this.name) + '=' + QueryParam._encodeURI(this.value)
    )
  }

  private static _encodeURI(str: string): string {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']')
  }
}
