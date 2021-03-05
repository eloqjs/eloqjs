import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Size', () => {
  it('should return the number of models in the collection', () => {
    const collection = new Collection<User>()
    expect(collection.size()).toBe(0)

    collection.add(new User())
    expect(collection.size()).toBe(1)

    collection.pop()
    expect(collection.size()).toBe(0)
  })
})
