import { Collection } from '../../../src/collection'
import User from './dummy/models/User'

describe('Feature – Collections – Count', () => {
  it('should return the number of models in the collection', () => {
    const collection = new Collection<User>()
    expect(collection.count()).toBe(0)

    collection.add(new User())
    expect(collection.count()).toBe(1)

    collection.pop()
    expect(collection.count()).toBe(0)
  })
})
