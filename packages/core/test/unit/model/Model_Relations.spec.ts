import { Collection, Relations } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'
import { assertInstanceOf } from '../../Helpers'

describe('Unit - Model – Relations', () => {
  it('can resolve has one relation', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      profile!: Relations.HasOne<Profile>

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

  it('can resolve has many relation', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      comments!: Relations.HasMany<Comment>

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
      comments!: Relations.HasMany<Comment>

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
})
