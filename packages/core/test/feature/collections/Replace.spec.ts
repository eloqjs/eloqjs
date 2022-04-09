import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Replace', () => {
  it('should replace all current models with the new ones', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const users = [
      new User({
        id: 1,
        name: 'Joe Doe'
      }),
      new User({
        id: 2,
        name: 'John Doe'
      })
    ]

    collection.add({ id: 3, name: 'Alex Doe' })
    collection.replace(users)

    assertCollection(collection, users)
  })

  it('should support replacing with plain objects', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    const users = collection.replace([
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    assertCollection(collection, users)
  })

  it('should support replacing with a single model', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })

    const user = new User({ id: 3, name: 'Alex Doe' })
    collection.replace(user)

    assertCollection(collection, [user])
  })

  it('should support replacing with a single object', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })

    const user = collection.replace({ id: 3, name: 'Alex Doe' })

    assertCollection(collection, [user])
  })

  it('should effectively remove all if replacing with an empty array', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    collection.replace([])

    expect(collection.isEmpty()).toBeTruthy()
  })

  it('should thrown an error if replacing with null', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => collection.replace(null)).toThrow('Expected a model, plain object, or array of either.')
  })

  it('should thrown an error if replacing with undefined', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => collection.replace(undefined)).toThrow('Expected a model, plain object, or array of either.')
  })

  it('should thrown an error if replacing with non-array or non-object', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => collection.replace(5)).toThrow('Expected a model, plain object, or array of either.')
  })
})
