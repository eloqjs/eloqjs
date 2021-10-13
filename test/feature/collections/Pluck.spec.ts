import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Pluck', () => {
  it('should return an array using the results of a column', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    expect(collection.pluck('id')).toEqual([1, 2, 3])
  })
})
