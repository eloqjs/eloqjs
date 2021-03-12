import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – GroupBy', () => {
  it('should group the models in this collection by the given key', () => {
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

    const groupedCollections = collection.groupBy('price')

    expect(Object.keys(groupedCollections)).toEqual(['150', '200'])

    expect(groupedCollections['150']).toBeInstanceOf(Collection)
    assertCollection(groupedCollections['150'], [
      { id: 2, name: 'Chair', price: 150 },
      { id: 3, name: 'Bookcase', price: 150 },
      { id: 4, name: 'Table', price: 150 }
    ])

    expect(groupedCollections['200']).toBeInstanceOf(Collection)
    assertCollection(groupedCollections['200'], [
      { id: 1, name: 'Desk', price: 200 },
      { id: 5, name: 'Monitor', price: 200 }
    ])
  })

  it('should support a closure', () => {
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

    const groupedCollections = collection.groupBy((model) =>
      String(model.price).substring(0, 2)
    )

    expect(Object.keys(groupedCollections)).toEqual(['15', '20'])

    expect(groupedCollections['15']).toBeInstanceOf(Collection)
    assertCollection(groupedCollections['15'], [
      { id: 2, name: 'Chair', price: 150 },
      { id: 3, name: 'Bookcase', price: 150 },
      { id: 4, name: 'Table', price: 150 }
    ])

    expect(groupedCollections['20']).toBeInstanceOf(Collection)
    assertCollection(groupedCollections['20'], [
      { id: 1, name: 'Desk', price: 200 },
      { id: 5, name: 'Monitor', price: 200 }
    ])
  })

  it(
    'should use an empty string as the key ' +
      'if objects are missing the key to group by',
    () => {
      const collection = new Collection<Product>([], {
        model: Product
      })

      collection.add([
        { id: 1, name: 'Desk', price: 200 },
        { id: 2, name: 'Chair', price: 150 },
        { id: 3, name: 'Bookcase', price: 150 },
        { id: 4, name: 'Table', price: null },
        { id: 5, name: 'Monitor', price: 200 }
      ])

      const groupedCollections = collection.groupBy('price')

      expect(Object.keys(groupedCollections)).toEqual(['150', '200', ''])

      assertCollection(groupedCollections[''], [
        { id: 4, name: 'Table', price: null }
      ])
    }
  )
})
