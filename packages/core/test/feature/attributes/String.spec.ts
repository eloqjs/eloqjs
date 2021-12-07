import BaseModel from '../../dummy/models/BaseModel'

describe('Feature – Attributes – String', () => {
  const data = [
    { id: 1 },
    { id: 2, str: 'value' },
    { id: 3, str: 1 },
    { id: 4, str: true }
  ]

  it('should cast the value to `String`', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      str!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          str: {
            type: String,
            cast: true,
            default: 'default'
          }
        }
      }
    }

    const users = []

    for (const record of data) {
      users.push(new User(record))
    }

    expect(users[0].str).toBe('default')
    expect(users[1].str).toBe('value')
    expect(users[2].str).toBe('1')
    expect(users[3].str).toBe('true')
  })

  it('should accept `null` when there is `nullable` chain', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      str!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          str: {
            type: String,
            cast: true,
            nullable: true,
            default: 'default'
          }
        }
      }
    }

    const users = []

    for (const record of [...data, { id: 5, str: null }]) {
      users.push(new User(record))
    }

    expect(users[0].str).toBe('default')
    expect(users[1].str).toBe('value')
    expect(users[2].str).toBe('1')
    expect(users[3].str).toBe('true')
    expect(users[4].str).toBeNull()
  })
})
