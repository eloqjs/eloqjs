import { Collection } from '../../../src/collection'
import User from './dummy/models/User'

describe('Feature – Collections – Each', () => {
  it('should iterate through each model', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    let position = 0

    collection.each((model, index, array) => {
      expect(model).toBe(added[index])
      expect(index).toBe(position++)
      expect(array).toEqual(added)
    })
  })
})
