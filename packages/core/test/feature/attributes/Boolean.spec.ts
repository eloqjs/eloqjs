import BaseModel from '../../dummy/models/BaseModel'

describe('Feature – Attributes – Boolean', () => {
  const data = [
    { id: 1 },
    { id: 2, bool: '' },
    { id: 3, bool: 'string' },
    { id: 4, bool: '0' },
    { id: 5, bool: 0 },
    { id: 6, bool: 1 },
    { id: 7, bool: true }
  ]

  it('should cast the value to `Boolean`', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      bool!: boolean

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          bool: {
            type: Boolean,
            cast: true,
            default: true
          }
        }
      }
    }

    const users = []

    for (const record of data) {
      users.push(new User(record))
    }

    expect(users[0].bool).toBeTruthy()
    expect(users[1].bool).toBeFalsy()
    expect(users[2].bool).toBeTruthy()
    expect(users[3].bool).toBeTruthy()
    expect(users[4].bool).toBeFalsy()
    expect(users[5].bool).toBeTruthy()
    expect(users[6].bool).toBeTruthy()
  })

  it('should accept `null` when there is `nullable` chain', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      bool!: boolean

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          bool: {
            type: Boolean,
            cast: true,
            nullable: true,
            default: true
          }
        }
      }
    }

    const users = []

    for (const record of [...data, { id: 8, bool: null }]) {
      users.push(new User(record))
    }

    expect(users[0].bool).toBeTruthy()
    expect(users[1].bool).toBeFalsy()
    expect(users[2].bool).toBeTruthy()
    expect(users[3].bool).toBeTruthy()
    expect(users[4].bool).toBeFalsy()
    expect(users[5].bool).toBeTruthy()
    expect(users[6].bool).toBeTruthy()
    expect(users[7].bool).toBeNull()
  })
})
