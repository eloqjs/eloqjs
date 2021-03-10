import { Collection } from '../../../src/collection/Collection'
import BaseModel from '../../dummy/models/BaseModel'
import { assertCollection, assertInstanceOf } from '../../Helpers'

describe('Unit – Collection', () => {
  class User extends BaseModel {
    static entity = 'users'

    id!: number

    static fields() {
      return {
        id: this.attr(null)
      }
    }
  }

  it('can initialize an empty collection', () => {
    const collection = new Collection()

    expect(collection).toBeInstanceOf(Collection)
    assertCollection(collection, [])
  })

  it('can extend collection', () => {
    class UserCollection extends Collection<User> {
      static model = User
    }

    const user = { id: 1 }
    const collection = new UserCollection([user])

    expect(collection).toBeInstanceOf(UserCollection)
    assertInstanceOf(collection, User)
  })

  it('should throw an error when trying to instantiate without model type', () => {
    const user = {
      id: 1
    }
    const collection = new Collection<User>()

    expect(() => collection.add(user)).toThrow(
      '[ELOQJS] Model type is not defined.'
    )
  })
})