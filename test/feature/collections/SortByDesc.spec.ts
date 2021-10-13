import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – SortByDesc', () => {
  it('should sort the models in the collection using a column comparator', () => {
    const users = [
      new User({ id: 1, name: 'Joe Doe' }),
      new User({ id: 2, name: 'John Doe' }),
      new User({ id: 3, name: 'Alex Doe' }),
      new User({ id: 4, name: 'Mary Doe' })
    ]
    const collection = new Collection<User>(users)

    assertCollection(collection, users)

    collection.sortByDesc('name')

    assertCollection(collection, [users[3], users[1], users[0], users[2]])
  })

  it('should sort the models in the collection using a callback', () => {
    const users = [
      new User({ id: 2, name: 'John Doe' }),
      new User({ id: 1, name: 'Joe Doe' }),
      new User({ id: 4, name: 'Mary Doe' }),
      new User({ id: 3, name: 'Alex Doe' })
    ]
    const collection = new Collection<User>(users)

    assertCollection(collection, users)

    collection.sortByDesc((model) => model.id)

    assertCollection(collection, [users[2], users[3], users[0], users[1]])
  })

  it('should mutate the collection itself', () => {
    const users = [
      new User({ id: 1, name: 'Joe Doe' }),
      new User({ id: 2, name: 'John Doe' }),
      new User({ id: 3, name: 'Alex Doe' }),
      new User({ id: 4, name: 'Mary Doe' })
    ]
    const collection = new Collection<User>(users)

    assertCollection(collection, users)

    const sortedCollection = collection.sortByDesc('name')
    expect(sortedCollection).toBe(collection)
    assertCollection(sortedCollection, collection.models)
  })
})
