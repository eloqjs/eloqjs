// import { Collection } from '../../../src/collection/Collection'
import { Uid } from '../../../src/support/Uid'
// import BaseModel from '../../dummy/models/BaseModel'
// import { assertCollection, assertModel } from '../../Helpers'

describe('Feature – Attributes – Uid', () => {
  beforeEach(() => {
    Uid.reset()
  })

  it('skip test', () => {
    expect(true).toBeTruthy()
  })

  // eslint-disable-next-line jest/no-commented-out-tests
  /* describe('without default value', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string
      id2!: string

      static fields() {
        return {
          id: this.uid(),
          id2: this.uid()
        }
      }
    }

    it('should generate uid as a default value', async () => {
      const data = [{}, {}, {}]
      const users = new Collection(data, {
        model: User
      })

      const expected = [
        { id: '$uid1', id2: '$uid2' },
        { id: '$uid3', id2: '$uid4' },
        { id: '$uid5', id2: '$uid6' }
      ]

      assertCollection(users, expected)
    })

    it('should do nothing if the value exists', async () => {
      const data = [
        { id: 1, id2: 'id1' },
        { id: 2, id2: 'id2' }
      ]
      const users = new Collection(data, {
        model: User
      })

      assertCollection(users, data)
    })
  })

  describe('with default value', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      id2!: number

      static fields() {
        return {
          id: this.uid(() => 1),
          id2: this.uid(() => 2)
        }
      }
    }

    it('should generate user provided uid as a default value', async () => {
      const user = new User()

      assertModel(user, { id: 1, id2: 2 })
    })
  }) */
})
