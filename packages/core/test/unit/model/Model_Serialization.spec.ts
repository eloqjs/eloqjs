import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model - Serialization', () => {
  it('can serialize own fields into json', () => {
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

  it('can serialize nested fields into json', () => {
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

  it('can serialize empty relation into json', () => {
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

  it('can serialize the array field', () => {
    class User extends BaseModel {
      static entity = 'users'

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          array: Array
        }
      }
    }

    const user = new User({ id: 1, array: [1, 2] })

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
          array: [1, 2]
        },
        reference: {
          id: 1,
          array: [1, 2]
        },
        changes: {}
      },
      relationships: {}
    })
  })
})
