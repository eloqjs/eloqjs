import { Collection } from '../../../src/collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – CountBy', () => {
  it('should count occurrences based on the closure', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { id: 1, name: 'Desk', price: 200 },
      { id: 2, name: 'Chair', price: 150 },
      { id: 3, name: 'Bookcase', price: 150 },
      { id: 4, name: 'Table', price: 150 },
      { id: 5, name: 'Monitor', price: 200 }
    ])

    const counted = collection.countBy((model) => String(model.price))

    expect(counted).toEqual({
      '150': 3,
      '200': 2
    })
  })
})
