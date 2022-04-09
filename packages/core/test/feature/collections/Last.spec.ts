import { Collection } from '../../../src/collection'
import User from './dummy/models/User'

describe('Feature – Collections – Last', () => {
  it('should return the first model', () => {
    const user1 = new User()
    const user2 = new User()
    const user3 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)
    collection.add(user3)

    expect(collection.last()).toBe(user3)
  })

  it('should return null when the collection is empty', () => {
    const collection = new Collection()

    expect(collection.last()).toBeNull()
  })
})
