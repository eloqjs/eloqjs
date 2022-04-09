import { Collection } from '../../../src/collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Median', () => {
  it('should return the median value of collection values by key', () => {
    const collection1 = new Collection<Product>([], {
      model: Product
    })

    collection1.add([{ price: 1 }, { price: 1 }, { price: 2 }, { price: 4 }])

    expect(collection1.median('price')).toBe(1.5)

    const collection2 = new Collection<Product>([], {
      model: Product
    })

    collection2.add([{ price: 1 }, { price: 3 }, { price: 3 }, { price: 6 }, { price: 7 }, { price: 8 }, { price: 9 }])

    expect(collection2.median('price')).toBe(6)
  })
})
