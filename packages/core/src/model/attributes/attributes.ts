export type AttributesData = Record<string, any>

export interface Attributes {
  get(key: string): any

  set(key: string, value: unknown): void

  has(key: string): boolean

  delete(key: string): void

  getAll(): AttributesData

  setAll(attributes: AttributesData): void

  clear(): void

  replace(attributes: AttributesData): void

  clone(): Attributes
}
