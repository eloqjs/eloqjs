import { Collection } from '@eloqjs/core'

import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Skip', () => {
  it('should skip the specified number of models and return a new collection with the rest', () => {
    const users = [
      new User({ id: 1, name: 'Joe Doe' }),
      new User({ id: 2, name: 'John Doe' }),
      new User({ id: 3, name: 'Alex Doe' }),
      new User({ id: 4, name: 'Mary Doe' })
    ]
    const collection = new Collection<User>(users)

    const skippedCollection = collection.skip(3)
    expect(skippedCollection).toBeInstanceOf(Collection)
    expect(skippedCollection).not.toBe(collection)
    assertCollection(skippedCollection, [users[3]])
  })
})
