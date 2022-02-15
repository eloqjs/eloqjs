import BaseModel from '../../dummy/models/BaseModel'
import User from '../../feature/collections/dummy/models/User'

describe('Unit – Model - Serialization', () => {
  it('can serialize own fields', () => {
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

    const user = new User({ id: 1, name: 'John Doe' })

    const json = user.$serialize()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({
      entity: 'users',
      options: {
        relations: true,
        overwriteIdentifier: false,
        patch: false,
        saveUnchanged: true
      },
      attributes: {
        data: {
          id: 1,
          name: 'John Doe'
        },
        reference: {
          id: 1,
          name: 'John Doe'
        },
        changes: {}
      },
      relationships: {}
    })
  })

  it('can serialize relationships', () => {
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

    const user = new User({
      id: 1,
      phone: { id: 2, user_id: 1 },
      posts: [
        { id: 3, user_id: 1 },
        { id: 4, user_id: 1 }
      ]
    })

    const json = user.$serialize()

    expect(json).not.toBeInstanceOf(User)
    expect(json.relationships.phone).not.toBeInstanceOf(Phone)
    expect(json.relationships.posts[0]).not.toBeInstanceOf(Post)
    expect(json.relationships.posts[1]).not.toBeInstanceOf(Post)
    expect(json).toEqual({
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

  it('can serialize empty relationships', () => {
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

    const user = new User({ id: 1 })

    const json = user.$serialize()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({
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

  it('should serialize options', () => {
    const user = new User({}, [], {
      foo: true
    })
    const serializedModel = user.$serialize()

    expect(serializedModel.options.foo).toBe(user.$getOption('foo'))
  })

  it('should serialize references', () => {
    const user = new User({ id: 1 })

    user.id = 2

    const serializedModel = user.$serialize()

    expect(serializedModel.attributes.data.id).toBe(user.id)
    expect(serializedModel.attributes.reference.id).toBe(user.$.id)
  })

  it('should serialize changes', () => {
    const user = new User({ id: 1 })

    user.id = 2

    user.$syncChanges()
    user.$syncReference()

    const clone = user.$clone()

    expect(clone.$getChanges()).toEqual(user.$getChanges())
  })
})
