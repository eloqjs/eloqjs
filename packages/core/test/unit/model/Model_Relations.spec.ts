import { Collection, HasMany, HasOne, Relation } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'
import { assertInstanceOf } from '../../Helpers'

describe('Unit - Model – Relations', () => {
  it('can resolve has one relation', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      profile!: HasOne<Profile>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          profile: {
            type: Profile,
            relation: 'HasOne'
          }
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number

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
      profile: { id: 3, user_id: 1 }
    })

    expect(user.id).toBe(1)

    expect(user.profile.data!).toBeInstanceOf(Profile)
    expect(user.profile.data!.id).toBe(3)
  })

  it('can clear has one relation', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      profile!: HasOne<Profile>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          profile: {
            type: Profile,
            relation: 'HasOne'
          }
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number

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
      profile: { id: 3, user_id: 1 }
    })

    expect(user.profile.data).not.toBeNull()

    user.$set('profile', null)

    expect(user.profile.data).toBeNull()
  })

  it('can resolve has many relation', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      comments!: HasMany<Comment>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          comments: {
            type: Comment,
            relation: 'HasMany'
          }
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      id!: number
      post_id!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          post_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: [
        { id: 1, post_id: 1 },
        { id: 2, post_id: 1 }
      ]
    })

    expect(post.id).toBe(1)

    assertInstanceOf(post.comments.data, Comment)
    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data.models).toHaveLength(2)
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[1].id).toBe(2)
  })

  it('can resolve empty has many relation', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      comments!: HasMany<Comment>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          comments: {
            type: Comment,
            relation: 'HasMany'
          }
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      // @Attribute
      id!: number

      // @Attribute
      post_id!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          post_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: []
    })

    expect(post).toBeInstanceOf(Post)
    expect(post.id).toBe(1)
    expect(post.comments.data).not.toBeNull()
    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data.models).toStrictEqual([])
    expect(post.comments.data.models).toHaveLength(0)
  })

  it('can clear has many relation', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      comments!: HasMany<Comment>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          comments: {
            type: Comment,
            relation: 'HasMany'
          }
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      id!: number
      post_id!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          post_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const post = new Post({
      id: 1,
      comments: [
        { id: 1, post_id: 1 },
        { id: 2, post_id: 1 }
      ]
    })

    expect(post.comments.data).toHaveLength(2)

    post.$set('comments', [])

    expect(post.comments.data).toHaveLength(0)
  })

  it('should overwrite has one relation with `fill`', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      name!: string
      profile!: HasOne<Profile>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          profile: {
            type: Profile,
            relation: 'HasOne'
          }
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number
      name!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const user = new User({
      id: 1,
      name: 'Joe Doe',
      profile: { id: 3, user_id: 1, name: 'Joe' }
    })

    expect(user.id).toBe(1)
    expect(user.name).toBe('Joe Doe')

    expect(user.profile.data!).toBeInstanceOf(Profile)
    expect(user.profile.data!.id).toBe(3)
    expect(user.profile.data!.name).toBe('Joe')

    user.$fill({
      name: 'John Doe',
      profile: { name: 'John' }
    })

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
    expect(user.$.name).toBe('Joe Doe')

    expect(user.profile).not.toBe(user.$.profile)
    expect(user.profile.data).not.toBe(user.$.profile.data)
    expect(user.profile.data!.name).toBe('John')
    expect(user.profile.data!.$.name).toBe('John')
  })

  it('should overwrite has one relation in empty state with `fill`', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      name!: string
      profile!: HasOne<Profile>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          profile: {
            type: Profile,
            relation: 'HasOne'
          }
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number
      name!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const user = new User({
      id: 1,
      name: 'Joe Doe'
    })

    expect(user.id).toBe(1)
    expect(user.name).toBe('Joe Doe')

    expect(user.profile.data!).toBeNull()

    user.$fill({
      name: 'John Doe',
      profile: { id: 3, user_id: 1, name: 'John' }
    })

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
    expect(user.$.name).toBe('Joe Doe')

    expect(user.profile.data!).toBeInstanceOf(Profile)
    expect(user.profile.data!.id).toBe(3)
    expect(user.profile.data!.name).toBe('John')
    expect(user.profile.data!.$.name).toBe('John')
  })

  it('should overwrite has many relation with `fill`', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      title!: string
      comments!: HasMany<Comment>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          title: String,
          comments: {
            type: Comment,
            relation: 'HasMany'
          }
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      id!: number
      message!: string
      post_id!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          message: String,
          post_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const post = new Post({
      id: 1,
      title: 'My post',
      comments: [
        { id: 1, message: 'foo', post_id: 1 },
        { id: 2, message: 'bar', post_id: 1 }
      ]
    })

    expect(post.id).toBe(1)
    expect(post.title).toBe('My post')

    assertInstanceOf(post.comments.data, Comment)

    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data.models).toHaveLength(2)
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[0].message).toBe('foo')
    expect(post.comments.data.models[1].id).toBe(2)
    expect(post.comments.data.models[1].message).toBe('bar')

    post.$fill({
      title: 'My awesome post',
      comments: [
        {
          id: 2,
          message: 'bar baz'
        }
      ]
    })

    expect(post.id).toBe(1)
    expect(post.title).toBe('My awesome post')

    expect(post.comments).not.toBe(post.$.comments)
    expect(post.comments.data).not.toBe(post.$.comments.data)

    expect(post.comments.data).toHaveLength(1)
    expect(post.comments.data.models[0].id).toBe(2)
    expect(post.comments.data.models[0].message).toBe('bar baz')
    expect(post.comments.data.models[0].$.message).toBe('bar baz')

    expect(post.$.comments.data.models).toHaveLength(2)
    expect(post.$.comments.data.models[0].id).toBe(1)
    expect(post.$.comments.data.models[0].message).toBe('foo')
    expect(post.$.comments.data.models[1].id).toBe(2)
    expect(post.$.comments.data.models[1].message).toBe('bar')
  })

  it('should overwrite an empty has many relation with `fill`', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      title!: string
      comments!: HasMany<Comment>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          title: String,
          comments: {
            type: Comment,
            relation: 'HasMany'
          }
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      id!: number
      message!: string
      post_id!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          message: String,
          post_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const post = new Post({
      id: 1,
      title: 'My post',
      comments: [
        { id: 1, message: 'foo', post_id: 1 },
        { id: 2, message: 'bar', post_id: 1 }
      ]
    })

    expect(post.id).toBe(1)
    expect(post.title).toBe('My post')

    assertInstanceOf(post.comments.data, Comment)
    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data.models).toHaveLength(2)
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[0].message).toBe('foo')
    expect(post.comments.data.models[1].id).toBe(2)
    expect(post.comments.data.models[1].message).toBe('bar')

    post.$fill({
      title: 'My awesome post'
    })

    expect(post.id).toBe(1)
    expect(post.title).toBe('My awesome post')
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[0].message).toBe('foo')
    expect(post.comments.data.models[0].$.message).toBe('foo')
    expect(post.comments.data.models[1].id).toBe(2)
    expect(post.comments.data.models[1].message).toBe('bar')
    expect(post.comments.data.models[1].$.message).toBe('bar')
  })

  it('should overwrite has one relation with `update`, then sync', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      name!: string
      profile!: HasOne<Profile>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          profile: {
            type: Profile,
            relation: 'HasOne'
          }
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number
      name!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const user = new User({
      id: 1,
      name: 'Joe Doe',
      profile: { id: 3, user_id: 1, name: 'Joe' }
    })

    expect(user.id).toBe(1)
    expect(user.name).toBe('Joe Doe')

    expect(user.profile.data!).toBeInstanceOf(Profile)
    expect(user.profile.data!.id).toBe(3)
    expect(user.profile.data!.name).toBe('Joe')

    user.$update({
      name: 'John Doe',
      profile: { name: 'John' }
    })

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
    expect(user.$.name).toBe('John Doe')

    expect(user.$.profile).toBe(user.profile)
    expect(user.$.profile.data).toBe(user.profile.data)
    expect(user.profile.data!.id).toBeNull()
    expect(user.profile.data!.name).toBe('John')
  })

  it('should overwrite has many relation with `update`, then sync', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      title!: string
      comments!: HasMany<Comment>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          title: String,
          comments: {
            type: Comment,
            relation: 'HasMany'
          }
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      id!: number
      message!: string
      post_id!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          message: String,
          post_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const post = new Post({
      id: 1,
      title: 'My post',
      comments: [
        { id: 1, message: 'foo', post_id: 1 },
        { id: 2, message: 'bar', post_id: 1 }
      ]
    })

    expect(post.id).toBe(1)
    expect(post.title).toBe('My post')

    assertInstanceOf(post.comments.data, Comment)
    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data).toHaveLength(2)
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[1].id).toBe(2)

    post.$update({
      title: 'My awesome post',
      comments: [
        {
          id: 1,
          message: 'foo bar'
        }
      ]
    })

    expect(post.id).toBe(1)
    expect(post.title).toBe('My awesome post')
    expect(post.$.comments).toBe(post.comments)
    expect(post.$.comments.data).toBe(post.comments.data)
    expect(post.comments.data).toHaveLength(1)
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[0].message).toBe('foo bar')
  })

  it('should not have same relation class instance in saved state', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      name!: string
      profile!: HasOne<Profile>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          profile: {
            type: Profile,
            relation: 'HasOne'
          }
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number
      name!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
          user_id: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const user = new User({
      id: 1,
      name: 'Joe Doe',
      profile: { id: 3, user_id: 1, name: 'Joe' }
    })

    user.$fill({
      name: 'John Doe',
      profile: { name: 'John' }
    })

    expect(user.profile).toBeInstanceOf(Relation)
    expect(user.$.profile).toBeInstanceOf(Relation)
    expect(user.$.profile).not.toBe(user.profile)
  })
})
