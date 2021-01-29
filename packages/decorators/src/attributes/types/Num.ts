import { Attributes } from '@eloqjs/core'

import { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a Number attribute property decorator.
 */
export function Num(
  value?: number | null,
  options: TypeOptions = {}
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = new Attributes.Number(self, value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}
