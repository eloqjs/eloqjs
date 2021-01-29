import { Relations } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Unit - Model – Relations', () => {
  it('can resolve has one relation', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      profile!: Relations.HasOne<Profile>

      static fields() {
        return {
          id: this.attr(null),
          profile: this.hasOne(Profile)
        }
      }
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      id!: number
      user_id!: number

      static fields() {
        return {
          id: this.attr(null),
          user_id: this.attr(null)
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
          id: this.attr(null),
          comments: this.hasMany(Comment)
        }
      }
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      id!: number
      post_id!: number

      static fields() {
        return {
          id: this.attr(null),
          post_id: this.attr(null)
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

    expect(post.comments.data).toHaveLength(2)
    expect(post.comments.data[0]).toBeInstanceOf(Comment)
    expect(post.comments.data[1]).toBeInstanceOf(Comment)
    expect(post.comments.data[0].id).toBe(1)
    expect(post.comments.data[1].id).toBe(2)
  })

  it('can resolve empty has many relation', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      id!: number
      comments!: Relations.HasMany<Comment>

      static fields() {
        return {
          id: this.attr(null),
          comments: this.hasMany(Comment)
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
          id: this.attr(null),
          post_id: this.attr(null)
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
    expect(post.comments.data).toEqual([])
    expect(post.comments.data).toHaveLength(0)
  })
})
