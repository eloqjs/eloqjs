import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Only', () => {
  const users = [
    new User({ id: 1, name: 'Joe Doe' }),
    new User({ id: 2, name: 'John Doe' }),
    new User({ id: 3, name: 'Alex Doe' }),
    new User({ id: 4, name: 'Mary Doe' })
  ]
  const collection = new Collection<User>(users)

  it('should return a collection containing only the models with the specified keys', () => {
    const filteredCollection = collection.only([2, 3])

    expect(filteredCollection).toBeInstanceOf(Collection)
    expect(filteredCollection).not.toBe(collection)
    assertCollection(filteredCollection, [users[1], users[2]])
  })

  it('should contain all models if keys is empty', () => {
    const filteredCollection = collection.only([])

    expect(filteredCollection).not.toBe(collection)
    assertCollection(filteredCollection, users)
  })

  it('should contain all models if null is passed', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filteredCollection = collection.only(null)

    expect(filteredCollection).not.toBe(collection)
    assertCollection(filteredCollection, users)
  })

  it('should contain all models if undefined is passed', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filteredCollection = collection.only(undefined)

    expect(filteredCollection).not.toBe(collection)
    assertCollection(filteredCollection, users)
  })

  it('should contain all models if a non-array is passed', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filteredCollection = collection.only(5)

    expect(filteredCollection).not.toBe(collection)
    assertCollection(filteredCollection, users)
  })
})
