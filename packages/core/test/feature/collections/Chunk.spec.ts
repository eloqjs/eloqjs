import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – Chunk', () => {
  it('should break the collection into multiple, smaller collections of a given size', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { id: 1, name: 'Desk', price: 200 },
      { id: 2, name: 'Chair', price: 100 },
      { id: 3, name: 'Bookcase', price: 150 },
      { id: 4, name: 'Table', price: 150 },
      { id: 5, name: 'Monitor', price: 200 },
      { id: 6, name: 'Mouse', price: 50 }
    ])

    const chunkedCollections = collection.chunk(3)

    expect(chunkedCollections).toHaveLength(2)

    expect(chunkedCollections[0]).toBeInstanceOf(Collection)
    assertCollection(chunkedCollections[0], [
      { id: 1, name: 'Desk', price: 200, manufacturer: null },
      { id: 2, name: 'Chair', price: 100, manufacturer: null },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: null }
    ])

    expect(chunkedCollections[1]).toBeInstanceOf(Collection)
    assertCollection(chunkedCollections[1], [
      { id: 4, name: 'Table', price: 150, manufacturer: null },
      { id: 5, name: 'Monitor', price: 200, manufacturer: null },
      { id: 6, name: 'Mouse', price: 50, manufacturer: null }
    ])
  })
})
