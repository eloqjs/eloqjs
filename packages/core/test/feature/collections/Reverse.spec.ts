import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Reverse', () => {
  const collection = new Collection<User>([], {
    model: User
  })

  const added = collection.add([
    { id: 1, name: 'Joe Doe' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Alex Doe' }
  ])

  it('should reverse the order of the collection items', () => {
    const reversed = collection.reverse()

    assertCollection(reversed, [
      { id: 3, name: 'Alex Doe' },
      { id: 2, name: 'John Doe' },
      { id: 1, name: 'Joe Doe' }
    ])
  })

  it('should not modify the original collection', () => {
    const reversed = collection.reverse()

    assertCollection(collection, added)
    expect(reversed.models).not.toBe(collection.models)
  })
})
