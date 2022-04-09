import { Collection } from '../../../src/collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Average', () => {
  it('should return the average value of collection values by key', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { name: 'Chair', price: 600 },
      { name: 'Desk', price: 900 },
      { name: 'Lamp', price: 150 }
    ])

    const avg = collection.average('price')
    expect(avg).toBe(550)
  })
})
