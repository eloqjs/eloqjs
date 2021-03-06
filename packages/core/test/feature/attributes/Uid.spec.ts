import { assertModel, assertModels } from '@eloqjs/test-utils'

import { Uid } from '../../../src/support/Uid'
import BaseModel from '../../dummy/models/BaseModel'

describe('Feature – Attributes – Uid', () => {
  beforeEach(() => {
    Uid.reset()
  })

  describe('without default value', () => {
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
      const users = []

      for (const record of data) {
        users.push(new User(record))
      }

      const expected = [
        { id: '$uid1', id2: '$uid2' },
        { id: '$uid3', id2: '$uid4' },
        { id: '$uid5', id2: '$uid6' }
      ]

      assertModels(users, expected)
    })

    it('should do nothing if the value exists', async () => {
      const data = [
        { id: 1, id2: 'id1' },
        { id: 2, id2: 'id2' }
      ]
      const users = []

      for (const record of data) {
        users.push(new User(record))
      }

      assertModels(users, data)
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
  })
})