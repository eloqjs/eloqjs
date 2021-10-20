import { Attributes } from '@eloqjs/core'

import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a String attribute property decorator.
 */
export function Str(
  value?: string | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$constructor()

    self.setRegistry(propertyKey, () => {
      const attr = new Attributes.String(self, value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}
