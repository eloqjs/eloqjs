import { Collection } from '../../../src/collection/Collection'
import User from '../collections/dummy/models/User'

describe('Feature – Models – RegisterCollection', () => {
  it('should register a collection', () => {
    const collection = new Collection<User>()
    const user = new User()

    user.$registerCollection(collection)

    expect(user.$collections).toEqual([collection])
  })

  it('should register an array of collections', () => {
    const collection1 = new Collection<User>()
    const collection2 = new Collection<User>()
    const user = new User()

    user.$registerCollection([collection1, collection2])

    expect(user.$collections).toEqual([collection1, collection2])
  })

  it('should quietly not allow registering the same collection twice', () => {
    const collection = new Collection<User>()
    const user = new User()

    user.$registerCollection(collection)
    user.$registerCollection(collection)

    expect(user.$collections).toEqual([collection])
  })

  it('should fail if we pass a null collection', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$registerCollection(null)).toThrow(
      '[ELOQJS] Collection is not valid.'
    )
  })

  it('should fail if we pass a undefined collection', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$registerCollection(undefined)).toThrow(
      '[ELOQJS] Collection is not valid.'
    )
  })

  it('should fail if we pass an object that is not a collection', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$registerCollection({ a: 1 })).toThrow(
      '[ELOQJS] Collection is not valid.'
    )
  })

  it('should fail if we pass a non-object', () => {
    const user = new User()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => user.$registerCollection(5)).toThrow(
      '[ELOQJS] Collection is not valid.'
    )
  })
})
