import { Collection } from '../../../src/collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Implode', () => {
  it('should glue together the collection', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([
      { name: 'Chair', price: 600 },
      { name: 'Desk', price: 900 },
      { name: 'Lamp', price: 150 }
    ])

    const implodeProduct = collection.implode('name', '-')
    const implodePrice = collection.implode('price', '-')

    expect(implodeProduct).toBe('Chair-Desk-Lamp')
    expect(implodePrice).toBe('600-900-150')
  })

  it('should replace null with a blank value', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add([{ name: 'Chair', price: 600 }, { name: 'Desk', price: 900 }, { name: 'Lamp' }])

    const implodeManufacturer = collection.implode('price', '-')
    expect(implodeManufacturer).toBe('600-900-')
  })
})
