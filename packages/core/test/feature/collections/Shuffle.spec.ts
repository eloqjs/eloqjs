import { Collection } from '../../../src/collection'
import User from './dummy/models/User'

describe('Feature – Collections – Shuffle', () => {
  it('should shuffle the items in the collection', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' },
      { id: 4, name: 'Mary Doe' }
    ])

    collection.shuffle()

    expect(collection).toHaveLength(4)

    collection.models.forEach((model) => {
      expect(model.id).toBeLessThanOrEqual(4)
    })
  })
})
