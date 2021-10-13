import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Shift', () => {
  it('should remove and return the first model', () => {
    const user1 = new User()
    const user2 = new User()
    const user3 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)
    collection.add(user3)

    expect(collection.shift()).toBe(user1)
    expect(collection.shift()).toBe(user2)
    expect(collection.shift()).toBe(user3)
  })

  it('should do nothing and return null if empty', () => {
    const collection = new Collection()

    expect(collection.shift()).toBeNull()
  })

  it('should unregister the collection from the model', () => {
    const collection = new Collection()
    const user = collection.add(new User())

    expect(user.$collections).toHaveLength(1)

    collection.shift()

    expect(user.$collections).toHaveLength(0)
  })
})
