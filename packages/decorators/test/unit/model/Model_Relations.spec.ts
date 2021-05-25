import { Collection, Relations } from '@eloqjs/core'
import { assertInstanceOf } from '@eloqjs/test-utils'

import { Attr, HasMany, HasOne } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Unit - Model – Relations', () => {
  it('can resolve has one relation', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @HasOne(() => Profile)
      profile!: Relations.HasOne<Profile>
    }

    class Profile extends BaseModel {
      static entity = 'profiles'

      @Attr(null)
      id!: number

      @Attr(null)
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

      @Attr(null)
      id!: number

      @HasMany(() => Comment)
      comments!: Relations.HasMany<Comment>
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      @Attr(null)
      id!: number

      @Attr(null)
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

    assertInstanceOf(post.comments.data, Comment)
    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data.models).toHaveLength(2)
    expect(post.comments.data.models[0].id).toBe(1)
    expect(post.comments.data.models[1].id).toBe(2)
  })

  it('can resolve empty has many relation', () => {
    class Post extends BaseModel {
      static entity = 'posts'

      @Attr(null)
      id!: number

      @HasMany(() => Comment)
      comments!: Relations.HasMany<Comment>
    }

    class Comment extends BaseModel {
      static entity = 'comments'

      @Attr(null)
      id!: number

      @Attr(null)
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
    expect(post.comments.data).toBeInstanceOf(Collection)
    expect(post.comments.data.models).toStrictEqual([])
    expect(post.comments.data.models).toHaveLength(0)
  })
})
