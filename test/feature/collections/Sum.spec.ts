import { Collection } from '../../../src/collection/Collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Sum', () => {
  it('should sum all models based on a column name', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add({ price: 150 })
    collection.add({ price: 250 })
    collection.add({ price: 350 })

    expect(collection.sum('price')).toBe(750)
  })

  it('should sum all models even if column does not exist', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })

    collection.add({})
    collection.add({ price: 250 })
    collection.add({})

    expect(collection.sum('price')).toBe(250)
  })

  it('should sum all models based on a callback', () => {
    const collection = new Collection<Product>([], {
      model: Product
    })
    collection.add({ price: 150 })
    collection.add({ price: 250 })
    collection.add({ price: 350 })

    const sum = collection.sum((model) => {
      return model.price * 2
    })

    expect(sum).toBe(1500)
  })

  it('should return 0 if the collection is empty', () => {
    const collection = new Collection<Product>()
    expect(collection.sum('price')).toBe(0)
  })

  it('should return 0 if called without a callback', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(new Collection().sum()).toBe(0)
  })
})
