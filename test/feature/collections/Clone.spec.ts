import { Collection } from '../../../src/collection/Collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Clone', () => {
  it('should clone the collection', () => {
    const collection = new Collection()
    const cloned = collection.clone()

    expect(cloned).not.toBe(collection)
  })

  it('should preserve the models', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    const cloned = collection.clone()

    assertCollection(cloned, added)
  })

  it('should preserve the options', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const cloned = collection.clone()

    const added = cloned.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    assertCollection(cloned, added)
  })

  it('should clone extended collection', () => {
    class UserCollection extends Collection<User> {
      static model = User
    }

    const collection = new UserCollection()
    const cloned = collection.clone()

    expect(cloned).not.toBe(collection)
  })

  it('should preserve the models of extended collection', () => {
    class UserCollection extends Collection<User> {
      static model = User
    }

    const collection = new UserCollection()

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    const cloned = collection.clone()

    assertCollection(cloned, added)
  })
})
