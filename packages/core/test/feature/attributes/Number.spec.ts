import BaseModel from '../../dummy/models/BaseModel'

describe('Feature – Attributes – Number', () => {
  const data = [
    { id: 1 },
    { id: 2, num: 1 },
    { id: 3, num: 1.5 },
    { id: 4, num: '2' },
    { id: 5, num: '2.5' },
    { id: 6, num: true },
    { id: 7, num: false },
    { id: 8, num: null }
  ]

  it('should cast the value to `Number`', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      num!: number

      static fields() {
        return {
          id: this.attr(null),
          num: this.number(0)
        }
      }
    }

    const users = []

    for (const record of data) {
      users.push(new User(record))
    }

    expect(users[0].num).toBe(0)
    expect(users[1].num).toBe(1)
    expect(users[2].num).toBe(1.5)
    expect(users[3].num).toBe(2)
    expect(users[4].num).toBe(2.5)
    expect(users[5].num).toBe(1)
    expect(users[6].num).toBe(0)
    expect(users[7].num).toBe(0)
  })

  it('should accept `null` when there is `nullable` chain', async () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      num!: number

      static fields() {
        return {
          id: this.attr(null),
          num: this.number(0).nullable()
        }
      }
    }

    const users = []

    for (const record of data) {
      users.push(new User(record))
    }

    expect(users[0].num).toBe(0)
    expect(users[1].num).toBe(1)
    expect(users[2].num).toBe(1.5)
    expect(users[3].num).toBe(2)
    expect(users[4].num).toBe(2.5)
    expect(users[5].num).toBe(1)
    expect(users[6].num).toBe(0)
    expect(users[7].num).toBeNull()
  })
})
