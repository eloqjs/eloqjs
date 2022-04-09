import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Split', () => {
  const collection = new Collection<User>([], {
    model: User
  })

  collection.add([
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Mary Doe' },
    { id: 4, name: 'Alex Doe' },
    { id: 5, name: 'Sara Doe' },
    { id: 6, name: 'Kate Doe' }
  ])

  it('should split a collection into the given number of collections', () => {
    const collections = collection.split(2)

    assertCollection(collections[0], [
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Mary Doe' }
    ])

    assertCollection(collections[1], [
      { id: 4, name: 'Alex Doe' },
      { id: 5, name: 'Sara Doe' },
      { id: 6, name: 'Kate Doe' }
    ])
  })

  it('should return an array of collections', () => {
    collection.split(2).forEach((collection) => {
      expect(collection).toBeInstanceOf(Collection)
    })
  })
})
