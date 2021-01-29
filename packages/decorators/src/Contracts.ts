import { Model } from '@eloqjs/core'

export type PropertyDecorator = (target: Model, propertyKey: string) => void

export interface TypeOptions {
  nullable?: boolean
}
