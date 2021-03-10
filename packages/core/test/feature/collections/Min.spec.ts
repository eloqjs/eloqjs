import { Collection } from '../../../src/collection/Collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Min', () => {
  it('should return the minimum value of a given key', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { name: 'Chair', price: 600 },
      { name: 'Desk', price: 900 },
      { name: 'Lamp', price: 150 }
    ])

    const min = collection.min('price')
    expect(min).toBe(150)
  })
})
