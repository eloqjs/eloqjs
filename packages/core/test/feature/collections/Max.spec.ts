import { Collection } from '../../../src/collection/Collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Max', () => {
  it('should return the maximum value of a given key', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([{ price: 600 }, { price: 900 }, { price: 150 }])

    expect(collection.max('price')).toBe(900)
  })
})
