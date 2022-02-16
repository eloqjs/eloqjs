import { Collection } from '../../../src'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Take', () => {
  const users = [
    new User({ id: 1, name: 'Joe Doe' }),
    new User({ id: 2, name: 'John Doe' }),
    new User({ id: 3, name: 'Alex Doe' }),
    new User({ id: 4, name: 'Mary Doe' })
  ]
  const collection = new Collection<User>(users)

  it('should return a new collection with the specified number of models', () => {
    const takenCollection = collection.take(3)

    expect(takenCollection).toBeInstanceOf(Collection)
    expect(takenCollection).not.toBe(collection)
    assertCollection(takenCollection, [users[0], users[1], users[2]])
  })

  it('should take from the end of the collection when passed a negative integer', () => {
    const takenCollection = collection.take(-2)

    assertCollection(takenCollection, [users[2], users[3]])
  })
})
