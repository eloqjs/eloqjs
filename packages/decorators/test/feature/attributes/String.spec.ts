import { Attr, Str } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Feature – Attributes – String', () => {
  const data = [
    { id: 1 },
    { id: 2, str: 'value' },
    { id: 3, str: 1 },
    { id: 4, str: true },
    { id: 5, str: null }
  ]

  it('should cast the value to `String`', async () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @Str('default')
      str!: string
    }

    const users = []

    for (const record of data) {
      users.push(new User(record))
    }

    expect(users[0].str).toBe('default')
    expect(users[1].str).toBe('value')
    expect(users[2].str).toBe('1')
    expect(users[3].str).toBe('true')
    expect(users[4].str).toBe('null')
  })

  it('should accept `null` when there is `nullable` chain', async () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @Str('default', { nullable: true })
      str!: string
    }

    const users = []

    for (const record of data) {
      users.push(new User(record))
    }

    expect(users[0].str).toBe('default')
    expect(users[1].str).toBe('value')
    expect(users[2].str).toBe('1')
    expect(users[3].str).toBe('true')
    expect(users[4].str).toBeNull()
  })
})
