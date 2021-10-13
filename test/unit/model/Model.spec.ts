import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model', () => {
  it('can fetch empty fields when model fields is not declared', () => {
    class User extends BaseModel {
      static entity = 'users'
    }

    expect(User.fields()).toEqual({})
  })

  it('should set default field values as a property on instantiation', () => {
    class User extends BaseModel {
      static entity = 'users'

      name!: string
      email!: string

      static fields() {
        return {
          name: {
            type: String,
            default: 'John Doe'
          },
          email: {
            type: String,
            default: 'john@example.com'
          }
        }
      }
    }

    const user = new User()

    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })

  it('should set default field values using a closure', () => {
    let counter = 0

    class User extends BaseModel {
      static entity = 'users'

      id!: number

      static fields() {
        return {
          id: {
            type: Number,
            default: () => counter++
          }
        }
      }
    }

    const user1 = new User()
    const user2 = new User()

    expect(user1.id).toBe(0)
    expect(user2.id).toBe(1)
  })

  it('should set given field values as a property on instantiation', () => {
    class User extends BaseModel {
      static entity = 'users'

      name!: string
      email!: string

      static fields() {
        return {
          name: {
            type: String,
            default: 'John Doe'
          },
          email: {
            type: String,
            default: 'john@example.com'
          }
        }
      }
    }

    const user = new User({ name: 'Jane Doe', age: 32 })

    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('john@example.com')
    expect((user as any).age).toBeUndefined()
  })

  it('can get a value of the primary key', () => {
    class User extends BaseModel {
      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    expect(User.getIdFromRecord({ id: 1 })).toBe(1)
  })

  it('can hydrate given record', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: {
            type: String,
            default: 'Default Doe'
          }
        }
      }
    }

    const record = User.hydrate({ id: 1, age: 24 })

    expect(record).toEqual({ id: 1, name: 'Default Doe' })
  })

  it('can hydrate without passing any record', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: {
            type: String,
            default: 'Default Doe'
          }
        }
      }
    }

    const record = User.hydrate()

    expect(record).toEqual({ id: null, name: 'Default Doe' })
  })
})
