import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Remove', () => {
  it('should remove a model', () => {
    const user = new User()
    const collection = new Collection<User>([user])

    collection.remove(user)

    expect(user.$collections).toEqual([])
    assertCollection(collection, [])
  })

  it('should remove by passing an object with ID', () => {
    const user = new User({ id: 1, name: 'Joe Doe' })
    const collection = new Collection<User>([user], {
      model: User
    })

    collection.remove({ id: 1 })

    assertCollection(collection, [])
  })

  it('should remove by predicate', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    collection.remove((model) => model.$id && model.$id > 1)

    expect(collection.models).toEqual([user1])
  })

  it('should remove an array of multiple objects', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    collection.remove([{ id: 2 }, { id: 3 }])

    assertCollection(collection, [user1])
  })

  it('should remove an array of multiple models', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    const user2 = collection.add({ id: 2, name: 'John Doe' })
    const user3 = collection.add({ id: 3, name: 'Alex Doe' })

    collection.remove([user2, user3])

    assertCollection(collection, [user1])
  })

  it('should skip remove if the collection does not contain the model', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    const user2 = collection.add({ id: 2, name: 'John Doe' })
    const user3 = new User({ id: 3, name: 'Alex Doe' })

    collection.remove(user3)
    assertCollection(collection, [user1, user2])
  })

  it('should unregister the collection from the model on remove', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user = collection.add({ id: 1, name: 'Joe Doe' })

    collection.remove(user)

    expect(user.$collections).toEqual([])
  })

  it('should return all models removed', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    const user2 = collection.add({ id: 2, name: 'John Doe' })
    const user3 = collection.add({ id: 3, name: 'Alex Doe' })

    const removed = collection.remove([user1, user2, user3])

    expect(removed).toEqual([user1, user2, user3])
  })

  it('should return all models removed by object', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    const user2 = collection.add({ id: 2, name: 'John Doe' })
    const user3 = collection.add({ id: 3, name: 'Alex Doe' })

    const removed = collection.remove([{ id: 1 }, { id: 2 }, { id: 3 }])

    expect(removed).toEqual([user1, user2, user3])
  })

  it('should return a single model when removing only one', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    const removed = collection.remove(user1)

    expect(removed).toBe(user1)
  })

  it('should return a single model when removing only one by object', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    const removed = collection.remove({ id: 1 })

    expect(removed).toBe(user1)
  })

  it('should return an array of models when removing by predicate', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    const removed = collection.remove((model) => {
      return model.id === 1
    })

    expect(removed).toEqual([user1])
  })

  it('should only return models that were removed', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const user1 = collection.add({ id: 1 })
    const user2 = new User({ id: 2 }) // Don't add to the collection
    const user3 = collection.add({ id: 3 })

    const removed = collection.remove([user1, user2, user3])

    expect(removed).toEqual([user1, user3])
  })

  it('should throw an error if model is null', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new Collection().remove(null)).toThrow(
      'Expected function, object, array, or model to remove.'
    )
  })

  it('should throw an error if model is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new Collection().remove(undefined)).toThrow(
      'Expected function, object, array, or model to remove.'
    )
  })

  it('should throw an error if model is false', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => new Collection().remove(false)).toThrow(
      'Expected function, object, array, or model to remove.'
    )
  })
})
