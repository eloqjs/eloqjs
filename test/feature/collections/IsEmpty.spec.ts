import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – IsEmpty', () => {
  it('should return true when empty', () => {
    const collection = new Collection<User>()

    expect(collection.isEmpty()).toBeTruthy()
  })

  it('should return false when not empty', () => {
    const collection = new Collection<User>([new User()])

    expect(collection.isEmpty()).toBeFalsy()
  })
})
