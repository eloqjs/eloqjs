import { Collection } from '../../../src/collection/Collection'
import { assertCollection, assertInstanceOf, assertModel } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Add', () => {
  it('should add a model', () => {
    const user = new User()
    const collection = new Collection<User>()

    collection.add(user)

    expect(user.$collections).toEqual([collection])
    assertCollection(collection, [user])
  })

  it('should add an array of models', () => {
    const collection = new Collection<User>()

    const user1 = new User()
    const user2 = new User()

    const added = collection.add([user1, user2])

    expect(added).toEqual([user1, user2])

    expect(user1.$collections).toEqual([collection])
    expect(user2.$collections).toEqual([collection])

    assertCollection(collection, [user1, user2])
  })

  it('should convert an object into a model on add', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const obj = { id: 1, name: 'Joe Doe' }
    const user = collection.add(obj)

    expect(user.$collections).toEqual([collection])

    assertInstanceOf(collection, User)
    assertCollection(collection, [user])

    assertModel(user, obj)
  })

  it('should convert an array of objects into models on add', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const obj1 = { id: 1, name: 'Joe Doe' }
    const obj2 = { id: 2, name: 'John Doe' }

    const added = collection.add([obj1, obj2])

    const user1 = added[0]
    const user2 = added[1]

    assertModel(user1, obj1)
    assertModel(user2, obj2)

    expect(user1.$collections).toEqual([collection])
    expect(user2.$collections).toEqual([collection])

    assertInstanceOf(collection, User)
    assertCollection(collection, [user1, user2])
  })

  it('should convert an object into a model when using an extended collection', () => {
    class UserCollection extends Collection<User> {
      static model = User
    }

    const obj = { id: 1, name: 'Joe Doe' }
    const collection = new UserCollection()

    const user = collection.add(obj)

    expect(user.$collections).toEqual([collection])

    assertCollection(collection, [user])
    assertInstanceOf(collection, User)

    assertModel(user, obj)
  })

  it('should add a model on initialize', () => {
    const user = new User()
    const collection = new Collection<User>([user])

    expect(user.$collections).toEqual([collection])
    assertCollection(collection, [user])
  })

  it('should skip add if the collection already contains the model', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user = collection.add({ id: 1, name: 'Joe Doe' })

    collection.add(user)
    assertCollection(collection, [user])
  })

  it('should register the collection to the model on add', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user = collection.add({ id: 1, name: 'Joe Doe' })

    expect(user.$collections).toEqual([collection])
  })

  it('should return one model if adding one', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    expect(typeof collection.add({})).toBe('object')
    expect(collection.add({})).toBeInstanceOf(User)
  })

  it('should return an array of models when adding many', () => {
    const collection = new Collection<User>()
    const added = collection.add([new User(), new User()])

    expect(Array.isArray(added)).toBeTruthy()
    expect(added[0]).toBeInstanceOf(User)
  })

  it('should return an array of models when adding many plain objects', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' }
    ])

    expect(Array.isArray(added)).toBeTruthy()

    expect(added[0]).toBeInstanceOf(User)
    expect(added[1]).toBeInstanceOf(User)

    expect(added[0].id).toBe(1)
    expect(added[1].id).toBe(2)
  })

  it('should thrown an error when trying to add a non-object-like model', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new Collection().add(5)).toThrow('Expected a model, plain object, or array of either.')
  })
})
