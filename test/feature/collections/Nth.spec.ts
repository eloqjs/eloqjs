import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – Nth', () => {
  const collection = new Collection<Product>([], {
    model: Product
  })

  const products = collection.add([
    { id: 1, name: 'Desk', price: 200 },
    { id: 2, name: 'Chair', price: 100 },
    { id: 3, name: 'Bookcase', price: 150 },
    { id: 4, name: 'Table', price: 150 },
    { id: 5, name: 'Monitor', price: 200 },
    { id: 6, name: 'Mouse', price: 50 }
  ])

  it('should create a new collection consisting of every n-th model', () => {
    assertCollection(collection.nth(2), [
      { id: 1, name: 'Desk', price: 200, manufacturer: null },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: null },
      { id: 5, name: 'Monitor', price: 200, manufacturer: null }
    ])
  })

  it('should return all models when receiving 1 as the first argument', () => {
    assertCollection(collection.nth(1), products)
  })

  it('should accept offset as the second argument', () => {
    assertCollection(collection.nth(2, 1), [
      { id: 2, name: 'Chair', price: 100, manufacturer: null },
      { id: 4, name: 'Table', price: 150, manufacturer: null },
      { id: 6, name: 'Mouse', price: 50, manufacturer: null }
    ])

    assertCollection(collection.nth(2, 3), [
      { id: 4, name: 'Table', price: 150, manufacturer: null },
      { id: 6, name: 'Mouse', price: 50, manufacturer: null }
    ])
  })
})
