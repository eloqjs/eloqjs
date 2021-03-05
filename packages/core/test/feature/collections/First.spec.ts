import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – First', () => {
  it('should return the first model', () => {
    const user1 = new User()
    const user2 = new User()
    const user3 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)
    collection.add(user3)

    expect(collection.first()).toBe(user1)
  })

  it('should return null when the collection is empty', () => {
    const collection = new Collection()

    expect(collection.first()).toBeNull()
  })
})
