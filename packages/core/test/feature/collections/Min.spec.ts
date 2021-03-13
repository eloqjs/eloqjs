import { Collection } from '../../../src/collection/Collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Min', () => {
  it('should return the minimum value of a given key', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([{ price: 600 }, { price: 900 }, { price: 150 }])

    expect(collection.min('price')).toBe(150)
  })

  it('should work with negative values', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { price: 1 },
      { price: 2 },
      { price: 3 },
      { price: 4 },
      { price: 5 },
      { price: -5 },
      { price: -4 },
      { price: -3 },
      { price: -2 },
      { price: -1 }
    ])

    expect(collection.min('price')).toBe(-5)
  })
})
