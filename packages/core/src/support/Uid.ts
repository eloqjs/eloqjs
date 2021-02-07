export type UidNamespace = 'attribute' | 'model' | 'collection'

export class Uid {
  /**
   * Count to create a unique id.
   */
  private static _count: Record<UidNamespace, number> = {
    attribute: 0,
    model: 0,
    collection: 0
  }

  /**
   * Prefix string to be used for the id.
   */
  private static _prefix: string = '$uid'

  /**
   * Generate an UUID.
   */
  public static make(namespace: UidNamespace = 'attribute'): string {
    this._count[namespace]++

    return `${this._prefix}${this._count[namespace]}`
  }

  /**
   * Reset the count to 0.
   */
  public static reset(namespace: string = 'global'): void {
    this._count[namespace] = 0
  }
}
