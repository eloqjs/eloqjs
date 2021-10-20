import { Attributes } from '@eloqjs/core'

import { PropertyDecorator } from '../../Contracts'

/**
 * Create an Attr attribute property decorator.
 */
export function Attr(value?: unknown): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$constructor()

    self.setRegistry(propertyKey, () => new Attributes.Attr(self, value))
  }
}
