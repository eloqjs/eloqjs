import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Reduce', () => {
  it('should reduce all values to a single result', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    const result = collection.reduce((result, model) => {
      return result + model.id
    }, 4)

    expect(result).toBe(10)
  })

  it('should receive args (result, model, index, array)', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    let i = 0

    collection.reduce((result, model, index, array) => {
      expect(result).toBe(4)
      expect(model).toBe(added[i])
      expect(index).toBe(i++)
      expect(array).toEqual(added)
      return result
    }, 4)
  })

  it('should use the first model as initial if initial not provided', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const user1 = collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    collection.reduce((result) => {
      expect(result).toBe(user1)
      return result
    })
  })

  it('should use a provided undefined initial', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add({ id: 1, name: 'Joe Doe' })
    collection.add({ id: 2, name: 'John Doe' })
    collection.add({ id: 3, name: 'Alex Doe' })

    const result = collection.reduce((result, model) => {
      return (result || 0) + model.id
    }, undefined as number | undefined)

    expect(result).toEqual(6)
  })
})
