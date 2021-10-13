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

    const json = user.$toJson()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({ id: 1, name: 'John Doe' })
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

    const json = user.$toJson()

    const expected = {
      id: 1,
      phone: { id: 2, user_id: 1 },
      posts: [
        { id: 3, user_id: 1 },
        { id: 4, user_id: 1 }
      ]
    }

    expect(json).not.toBeInstanceOf(User)
    expect(json.phone).not.toBeInstanceOf(Phone)
    expect(json.posts[0]).not.toBeInstanceOf(Post)
    expect(json.posts[1]).not.toBeInstanceOf(Post)
    expect(json).toEqual(expected)
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

    const json = user.$toJson()

    const expected = { id: 1, phone: null }

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual(expected)
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

    const json = user.$toJson()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({ id: 1, array: [1, 2] })
  })
})
