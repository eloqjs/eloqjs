import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – ForPage', () => {
  it('should return a collection containing the models that would be present on a given page number', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    const products = collection.add([
      { id: 1, name: 'Desk', price: 200 },
      { id: 2, name: 'Chair', price: 100 },
      { id: 3, name: 'Bookcase', price: 150 },
      { id: 4, name: 'Table', price: 150 },
      { id: 5, name: 'Monitor', price: 200 },
      { id: 6, name: 'Mouse', price: 50 },
      { id: 7, name: 'Keyboard', price: 300 },
      { id: 8, name: 'Notebook', price: 350 },
      { id: 9, name: 'Door', price: 100 }
    ])

    const forPage1 = collection.forPage(1, 3)
    assertCollection(forPage1, [products[0], products[1], products[2]])

    expect(forPage1).toBeInstanceOf(Collection)
    expect(forPage1).not.toBe(collection)

    const forPage2 = collection.forPage(2, 3)
    assertCollection(forPage2, [products[3], products[4], products[5]])

    const forPage3 = collection.forPage(3, 3)
    assertCollection(forPage3, [products[6], products[7], products[8]])
  })
})
