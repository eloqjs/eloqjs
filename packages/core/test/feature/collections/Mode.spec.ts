import { Collection } from '../../../src/collection/Collection'
import Product from './dummy/models/Product'

describe('Feature – Collections – Mode', () => {
  it('should return the mode value of collection values by key', () => {
    const collection1 = new Collection<Product>([], {
      model: Product
    })

    collection1.add([{ price: 1 }, { price: 1 }, { price: 2 }, { price: 4 }])

    expect(collection1.mode('price')).toEqual([1])

    const collection2 = new Collection<Product>([], {
      model: Product
    })

    collection2.add([
      { price: 1 },
      { price: 3 },
      { price: 3 },
      { price: 6 },
      { price: 7 },
      { price: 8 },
      { price: 9 }
    ])

    expect(collection2.mode('price')).toEqual([3])
  })

  it('should return array with multiple values if necessary', () => {
    const collection1 = new Collection<Product>([], {
      model: Product
    })

    collection1.add([{ price: 1 }, { price: 2 }, { price: 3 }])

    const collection2 = new Collection<Product>([], {
      model: Product
    })

    collection2.add([
      { price: 1 },
      { price: 1 },
      { price: 2 },
      { price: 4 },
      { price: 4 }
    ])

    expect(collection1.mode('price')).toEqual([1, 2, 3])
    expect(collection2.mode('price')).toEqual([1, 4])
  })

  it('should return null if collection is empty', () => {
    const collectionOfObjects = new Collection()

    expect(collectionOfObjects.mode('foo')).toBeNull()
  })
})
