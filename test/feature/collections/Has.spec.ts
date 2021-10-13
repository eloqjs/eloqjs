import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Has', () => {
  it('should return true when given a model instance that is in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)

    expect(collection.has(user1)).toBeTruthy()
    expect(collection.has(user2)).toBeTruthy()
  })

  it('should return false when given a model instance that is not in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)

    expect(collection.has(user2)).toBeFalsy()
  })

  it('should return true when all given model instances are in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)

    expect(collection.has([user1, user2])).toBeTruthy()
  })

  it('should return false when not all given model instances are in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)

    expect(collection.has([user1, user2])).toBeFalsy()
  })
})
