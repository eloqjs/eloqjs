import { Attributes } from '@eloqjs/core'

import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a Boolean attribute property decorator.
 */
export function Bool(
  value?: boolean | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = new Attributes.Boolean(self, value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}
