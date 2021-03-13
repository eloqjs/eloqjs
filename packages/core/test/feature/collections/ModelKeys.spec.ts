import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – ModelKeys', () => {
  it('should return an array of primary keys', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])

    expect(collection.modelKeys()).toEqual([1, 2, 3, 4, 5])
  })
})
