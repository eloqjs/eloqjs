import { Attr } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model', () => {
  it('should set default field values as a property on instantiation', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr('John Doe')
      name!: string

      @Attr('john@example.com')
      email!: string
    }

    const user = new User()

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })

  it('should set default field values using a closure', () => {
    let counter = 0

    class User extends BaseModel {
      static entity = 'users'

      @Attr(() => counter++)
      id!: number
    }

    const user1 = new User()
    const user2 = new User()

    expect(user1.id).toBe(0)
    expect(user2.id).toBe(1)
  })

  it('should set given field values as a property on instantiation', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr('John Doe')
      name!: string

      @Attr('john@example.com')
      email!: string
    }

    const user = new User({ name: 'Jane Doe', age: 32 })

    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('john@example.com')
    expect((user as any).age).toBeUndefined()
  })

  it('can get a value of the primary key', () => {
    class User extends BaseModel {
      @Attr(null)
      id!: number
    }

    expect(User.getIdFromRecord({ id: 1 })).toBe(1)
  })

  it('can hydrate given record', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @Attr('Default Doe')
      name!: string
    }

    const record = User.hydrate({ id: 1, age: 24 })

    expect(record).toEqual({ id: 1, name: 'Default Doe' })
  })

  it('can hydrate without passing any record', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @Attr('Default Doe')
      name!: string
    }

    const record = User.hydrate()

    expect(record).toEqual({ id: null, name: 'Default Doe' })
  })
})
