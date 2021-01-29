import BaseModel from '../../dummy/models/BaseModel'

describe('Feature – Attributes – Boolean', () => {
  const data = [
    { id: 1 },
    { id: 2, bool: '' },
    { id: 3, bool: 'string' },
    { id: 4, bool: '0' },
    { id: 5, bool: 0 },
    { id: 6, bool: 1 },
    { id: 7, bool: true },
    { id: 8, bool: null }
  ]

  it('should cast the value to `Boolean`', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      bool!: boolean

      static fields() {
        return {
          id: this.attr(null),
          bool: this.boolean(true)
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
    expect(users[3].bool).toBeFalsy()
    expect(users[4].bool).toBeFalsy()
    expect(users[5].bool).toBeTruthy()
    expect(users[6].bool).toBeTruthy()
    expect(users[7].bool).toBeFalsy()
  })

  it('should accept `null` when there is `nullable` chain', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      bool!: boolean

      static fields() {
        return {
          id: this.attr(null),
          bool: this.boolean(true).nullable()
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
    expect(users[3].bool).toBeFalsy()
    expect(users[4].bool).toBeFalsy()
    expect(users[5].bool).toBeTruthy()
    expect(users[6].bool).toBeTruthy()
    expect(users[7].bool).toBeNull()
  })
})
