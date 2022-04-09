import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import Product from './dummy/models/Product'

describe('Feature – Collections – Where', () => {
  const collection = new Collection<Product>([], {
    model: Product
  })

  const products = collection.add([
    { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
    { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
    { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
    { id: 4, name: 'Door', price: '100' }
  ])

  it('should filter the collection by a given key/value pair', () => {
    const filtered = collection.where('price', 100)

    assertCollection(filtered, [
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])
  })

  it('should return everything that matches', () => {
    const filtered = collection.where('manufacturer', 'IKEA')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: less than', () => {
    const under200 = collection.where('price', '<', 150)

    assertCollection(under200, [
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])
  })

  it('should accept a custom operator: less than or equal to', () => {
    const overOrExactly150 = collection.where('price', '<=', 150)

    assertCollection(overOrExactly150, [
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])
  })

  it('should accept a custom operator: bigger than', () => {
    const over150 = collection.where('price', '>', 150)

    assertCollection(over150, [{ id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' }])
  })

  it('should accept a custom operator: bigger than or equal to', () => {
    const overOrExactly150 = collection.where('price', '>=', 150)

    assertCollection(overOrExactly150, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: loosely equal', () => {
    const loosly100 = collection.where('price', '==', 100)

    assertCollection(loosly100, [
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])
  })

  it('should accept a custom operator: strictly not equal', () => {
    const not100 = collection.where('price', '!==', 100)

    assertCollection(not100, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])
  })

  it('should accept a custom operator: loosely not equal', () => {
    const not200 = collection.where('price', '!=', 200)

    assertCollection(not200, [
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])

    const not100 = collection.where('price', '<>', 100)

    assertCollection(not100, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; starts with (value%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK%')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; ends with (%value)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', '%ler')

    assertCollection(filtered, [{ id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' }])
  })

  it('should accept a custom operator: LIKE; any position (%value%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', '%KE%')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; second position (_value%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', '_KE%')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; starts with and are at least 2 characters in length (value_%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK_%')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; starts with and are at least 3 characters in length (value__%)', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK__%')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; starts with and ends with', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'I%A')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should accept a custom operator: LIKE; should use default operator (any position) when an invalid operator was provided', () => {
    const filtered = collection.where('manufacturer', 'LIKE', 'IK')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should use default operator (strictly equal) when an invalid operator was provided', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filtered = collection.where('manufacturer', '====', 'IKEA')

    assertCollection(filtered, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])
  })

  it('should work when only passing one argument', () => {
    const hasManufacturer = collection.where('manufacturer')

    assertCollection(hasManufacturer, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])

    const hasProduct = collection.where('name')

    assertCollection(hasProduct, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' },
      { id: 4, name: 'Door', price: '100', manufacturer: null }
    ])
  })

  it('should work when passing two argument', () => {
    const hasManufacturer = collection.where('manufacturer', true)

    assertCollection(hasManufacturer, [
      { id: 1, name: 'Desk', price: 200, manufacturer: 'IKEA' },
      { id: 2, name: 'Chair', price: 100, manufacturer: 'Herman Miller' },
      { id: 3, name: 'Bookcase', price: 150, manufacturer: 'IKEA' }
    ])

    const dontHaveManufacturer = collection.where('manufacturer', false)

    assertCollection(dontHaveManufacturer, [{ id: 4, name: 'Door', price: '100', manufacturer: null }])
  })

  it('should not mutate the collection itself', () => {
    const filtered = collection.where('price', 100)

    assertCollection(collection, products)
    expect(filtered.models).not.toEqual(collection.models)
  })
})
