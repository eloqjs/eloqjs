import BaseModel from '../../dummy/models/BaseModel'
import User from '../../feature/collections/dummy/models/User'

describe('Unit – Model - Deserialization', () => {
  it('can deserialize own fields', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String
        }
      }
    }

    const user1 = new User({ id: 1, name: 'John Doe' })
    const user2 = new User()

    user2.$deserialize(user1.$serialize())

    expect(user2).not.toBe(user1)
    expect(user2.$serialize()).toEqual(user1.$serialize())
  })

  it('can deserialize on create instance', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String
        }
      }
    }

    const user1 = new User({ id: 1, name: 'John Doe' })
    const user2 = new User(user1.$serialize())

    expect(user2).not.toBe(user1)
    expect(user1.$serialize()).toEqual(user2.$serialize())
  })

  it('can deserialize relationships', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          phone: {
            type: Phone,
            relation: 'HasOne'
          },
          posts: {
            type: Post,
            relation: 'HasMany'
          }
        }
      }
    }

    class Phone extends BaseModel {
      static entity = 'phones'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    class Post extends BaseModel {
      static entity = 'posts'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const user1 = new User({
      id: 1,
      phone: { id: 2, user_id: 1 },
      posts: [
        { id: 3, user_id: 1 },
        { id: 4, user_id: 1 }
      ]
    })
    const user2 = new User(user1.$serialize())

    expect(user2.$serialize()).toEqual({
      entity: 'users',
      options: {
        relations: true,
        overwriteIdentifier: false,
        patch: false,
        saveUnchanged: true
      },
      attributes: {
        data: {
          id: 1
        },
        reference: {
          id: 1
        },
        changes: {}
      },
      relationships: {
        phone: {
          entity: 'phones',
          options: {
            relations: true,
            overwriteIdentifier: false,
            patch: false,
            saveUnchanged: true
          },
          attributes: {
            data: {
              id: 2,
              user_id: 1
            },
            reference: {
              id: 2,
              user_id: 1
            },
            changes: {}
          },
          relationships: {}
        },
        posts: [
          {
            entity: 'posts',
            options: {
              relations: true,
              overwriteIdentifier: false,
              patch: false,
              saveUnchanged: true
            },
            attributes: {
              data: {
                id: 3,
                user_id: 1
              },
              reference: {
                id: 3,
                user_id: 1
              },
              changes: {}
            },
            relationships: {}
          },
          {
            entity: 'posts',
            options: {
              relations: true,
              overwriteIdentifier: false,
              patch: false,
              saveUnchanged: true
            },
            attributes: {
              data: {
                id: 4,
                user_id: 1
              },
              reference: {
                id: 4,
                user_id: 1
              },
              changes: {}
            },
            relationships: {}
          }
        ]
      }
    })
  })

  it('can deserialize empty relationships', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          phone: {
            type: Phone,
            relation: 'HasOne'
          }
        }
      }
    }

    class Phone extends BaseModel {
      static entity = 'phones'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const user1 = new User({ id: 1 })
    const user2 = new User(user1.$serialize())

    expect(user2.$serialize()).toEqual({
      entity: 'users',
      options: {
        relations: true,
        overwriteIdentifier: false,
        patch: false,
        saveUnchanged: true
      },
      attributes: {
        data: {
          id: 1
        },
        reference: {
          id: 1
        },
        changes: {}
      },
      relationships: {}
    })
  })

  it('should deserialize options', () => {
    const user = new User({}, [], {
      foo: true
    })
    const clone = new User(user.$serialize())

    expect(clone.$getOption('foo')).toBe(user.$getOption('foo'))
  })

  it('should deserialize references', () => {
    const user = new User({ id: 1 })

    user.id = 2

    const clone = new User(user.$serialize())

    expect(clone.id).toBe(user.id)
    expect(clone.$.id).toBe(user.$.id)
  })

  it('should deserialize changes', () => {
    const user = new User({ id: 1 })

    user.id = 2

    user.$syncChanges()
    user.$syncReference()

    const clone = new User(user.$serialize())

    expect(clone.$getChanges()).toEqual(clone.$getChanges())
  })
})
