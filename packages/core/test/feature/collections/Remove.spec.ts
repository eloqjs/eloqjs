import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Remove', () => {
  it('should remove model', () => {
    const user = new User()
    const collection = new Collection<User>([user])

    collection.remove(user)

    assertCollection(collection, [])
  })

  it('should remove by passing an object with ID', () => {
    const user = new User({ id: 1 })
    const collection = new Collection<User>([user], {
      model: User
    })

    collection.remove({ id: 1 })

    assertCollection(collection, [])
  })

  it('should remove by filtering', () => {
    const user1 = new User({ id: 1 })
    const user2 = new User({ id: 2 })
    const user3 = new User({ id: 3 })
    const collection = new Collection<User>([user1, user2, user3])

    collection.remove((model) => model.$id && model.$id > 1)

    expect(collection.models).toEqual([user1])
  })

  it('should remove multiple models', () => {
    const user1 = new User({ id: 1 })
    const user2 = new User({ id: 2 })
    const user3 = new User({ id: 3 })
    const collection = new Collection<User>([user1, user2, user3], {
      model: User
    })

    collection.remove([user2, { id: 3 }])

    assertCollection(collection, [user1])
  })
})
