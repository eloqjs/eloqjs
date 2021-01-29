import { Attributes, Model } from '@eloqjs/core'

import { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-one attribute property decorator.
 */
export function HasOne(related: () => typeof Model): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => new Attributes.HasOne(self, related()))
  }
}
