import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – TakeUntil', () => {
  const collection = new Collection<Product>([], {
    model: Product
  })

  const products = collection.add([
    { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
    { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
    { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
    { id: 4, name: 'Door', price: '100' }
  ])

  it('should take values', () => {
    assertCollection(collection.takeUntil(products[2]), [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' }
    ])
  })

  it('should accept a callback', () => {
    const subset = collection.takeUntil((item) => item.id >= 3)

    assertCollection(subset, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' }
    ])
  })
})
