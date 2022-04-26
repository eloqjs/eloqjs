import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – Filter', () => {
  const collection = new Collection<Product>([], {
    model: Product
  })

  const products = collection.add([
    { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
    { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
    { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
    { id: 4, name: 'Door', price: '100' }
  ])

  it('should filter the collection by a given callback, filtering based on value', () => {
    const filtered = collection.filter((model) => model.price > 100)

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should not mutate the collection itself', () => {
    const filtered = collection.filter((model) => model.price > 100)

    assertCollection(collection, products)
    expect(filtered.models).not.toBe(collection.models)
  })
})
