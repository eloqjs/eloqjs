import { assertInstanceOf } from '@eloqjs/test-utils'

import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Add', () => {
  it('should add model', () => {
    const user = new User()
    const collection = new Collection<User>()

    collection.add(user)

    expect(collection.models).toEqual([user])
  })

  it('should convert an object into model on add', () => {
    const user = {
      id: 1
    }
    const collection = new Collection<User>([], {
      model: User
    })

    collection.add(user)

    assertInstanceOf(collection.models, User)
  })

  it('should add model on initialize', () => {
    const user = new User()
    const collection = new Collection<User>([user])

    expect(collection.models).toEqual([user])
  })
})
