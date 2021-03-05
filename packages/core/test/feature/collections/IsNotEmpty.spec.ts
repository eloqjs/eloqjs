import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – IsNotEmpty', () => {
  it('should return true when not empty', () => {
    const collection = new Collection<User>([new User()])

    expect(collection.isNotEmpty()).toBeTruthy()
  })

  it('should return false when empty', () => {
    const collection = new Collection<User>()

    expect(collection.isNotEmpty()).toBeFalsy()
  })
})
