import { Collection } from '../../../src/collection/Collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Max', () => {
  it('should return the maximum value of a given key', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { name: 'Chair', price: 600 },
      { name: 'Desk', price: 900 },
      { name: 'Lamp', price: 150 }
    ])

    const max = collection.max('price')
    expect(max).toBe(900)
  })
})
