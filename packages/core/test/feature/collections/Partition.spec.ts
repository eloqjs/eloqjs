import { Collection } from '../../../src/collection'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Partition', () => {
  it('should separate models that pass a given truth test from those that do not', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Mary Doe' },
      { id: 4, name: 'Alex Doe' },
      { id: 5, name: 'Sara Doe' },
      { id: 6, name: 'Kate Doe' }
    ])

    const array = collection.partition((model) => model.id < 3)

    assertCollection(array[0], [
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' }
    ])
    assertCollection(array[1], [
      { id: 3, name: 'Mary Doe' },
      { id: 4, name: 'Alex Doe' },
      { id: 5, name: 'Sara Doe' },
      { id: 6, name: 'Kate Doe' }
    ])
  })
})
