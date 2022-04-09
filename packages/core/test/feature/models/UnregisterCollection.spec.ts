import { Collection } from '../../../src/collection'
import User from '../collections/dummy/models/User'

describe('Feature – Models – UnregisterCollection', () => {
  it('should unregister a collection', () => {
    const collection = new Collection<User>()
    const user = new User()

    user.$registerCollection(collection)
    user.$unregisterCollection(collection)

    expect(user.$collections).toEqual([])
  })

  it('should unregister an array of collections', () => {
    const collection1 = new Collection<User>()
    const collection2 = new Collection<User>()
    const user = new User()

    user.$registerCollection([collection1, collection2])
    user.$unregisterCollection([collection1, collection2])

    expect(user.$collections).toEqual([])
  })

  it('should quietly not allow unregistering the same collection twice', () => {
    const collection = new Collection<User>()
    const user = new User()

    user.$registerCollection(collection)
    user.$unregisterCollection(collection)
    user.$unregisterCollection(collection)

    expect(user.$collections).toEqual([])
  })

  it('should not mind if a collection is not registered', () => {
    const collection = new Collection<User>()
    const user = new User()

    user.$unregisterCollection(collection)

    expect(user.$collections).toEqual([])
  })

  it('should fail if we pass a null collection', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$unregisterCollection(null)).toThrow('[ELOQJS] Collection is not valid.')
  })

  it('should fail if we pass a undefined collection', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$unregisterCollection(undefined)).toThrow('[ELOQJS] Collection is not valid.')
  })

  it('should fail if we pass an object that is not a collection', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$unregisterCollection({ a: 1 })).toThrow('[ELOQJS] Collection is not valid.')
  })

  it('should fail if we pass a non-object', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$unregisterCollection(5)).toThrow('[ELOQJS] Collection is not valid.')
  })
})
