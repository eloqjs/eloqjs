import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Clear', () => {
  it('should clear all models', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({})
    collection.add({})
    collection.add({})

    expect(collection).toHaveLength(3)
    collection.clear()

    expect(collection).toHaveLength(0)
    assertCollection(collection, [])
  })

  it('should unregister all cleared models from the collection', () => {
    const collection = new Collection<User>()
    const user = new User()

    collection.add(user)
    expect(user.$collections).toHaveLength(1)

    collection.clear()
    expect(user.$collections).toHaveLength(0)
  })
})
