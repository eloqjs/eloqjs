import { Collection } from '../../../src/collection'
import User from './dummy/models/User'

describe('Feature – Collections – Includes', () => {
  it('should return true when given a model instance that is in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)

    expect(collection.includes(user1)).toBeTruthy()
    expect(collection.includes(user2)).toBeTruthy()
  })

  it('should return false when given a model instance that is not in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)

    expect(collection.includes(user2)).toBeFalsy()
  })

  it('should return true when all given model instances are in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)
    collection.add(user2)

    expect(collection.includes([user1, user2])).toBeTruthy()
  })

  it('should return false when not all given model instances are in the collection', () => {
    const user1 = new User()
    const user2 = new User()
    const collection = new Collection<User>()

    collection.add(user1)

    expect(collection.includes([user1, user2])).toBeFalsy()
  })
})
