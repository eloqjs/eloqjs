import { Attributes, Model } from '@eloqjs/core'

import { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-many attribute property decorator.
 */
export function HasMany(related: () => typeof Model): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => new Attributes.HasMany(self, related()))
  }
}
