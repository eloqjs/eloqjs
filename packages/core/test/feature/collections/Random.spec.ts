import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Random', () => {
  const users = [
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alex Doe' },
    { id: 4, name: 'Mary Doe' }
  ]

  const collection = new Collection<User>(users, {
    model: User
  })

  it('should return a random model from the collection', () => {
    const random = collection.random()

    expect(random!.id).toBeLessThanOrEqual(4)
    expect(collection).toHaveLength(4)
  })

  it('should return n random models from the collection', () => {
    const collectionOfRandomValues = collection.random(3)

    expect(collectionOfRandomValues).toHaveLength(3)
    expect(collectionOfRandomValues.models[0].id).toBeLessThanOrEqual(4)
    expect(collectionOfRandomValues.models[1].id).toBeLessThanOrEqual(4)
    expect(collectionOfRandomValues.models[2].id).toBeLessThanOrEqual(4)
    expect(collectionOfRandomValues.models[3]).toBeUndefined()
  })

  it('should return n random models from the collection, also when 1 is passed', () => {
    const collectionOfRandomValues = collection.random(1)

    expect(collectionOfRandomValues).toHaveLength(1)
    expect(collectionOfRandomValues.models[0].id).toBeLessThanOrEqual(4)
  })

  it('should not modify the collection', () => {
    collection.random()

    assertCollection(collection, users)
  })
})
