import { Relations } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Features – Relations – Has Many', () => {
  class User extends BaseModel {
    static entity = 'users'

    id!: number
    name!: string
    posts!: Relations.HasMany<Post>

    static fields() {
      return {
        id: this.attr(null),
        name: this.string(''),
        posts: this.hasMany(Post)
      }
    }
  }

  class Post extends BaseModel {
    static entity = 'posts'

    static primaryKey = 'slug'

    id!: number
    user_id!: number
    title!: string

    static fields() {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        slug: this.string(''),
        title: this.string('')
      }
    }
  }

  it('can create data containing the has many relation', async () => {
    const data = {
      id: 1,
      name: 'John Doe',
      posts: [
        {
          id: 1,
          user_id: 1,
          slug: 'my-awesome-post',
          title: 'My awesome post!'
        },
        { id: 2, user_id: 1, slug: 'my-super-post', title: 'My super post!' }
      ]
    }
    const user = new User(data)

    expect(user.$toJson()).toEqual(data)

    for (const post of user.posts.data) {
      expect(post).toBeInstanceOf(Post)
    }
  })

  it('can create data when the has many relation is empty', async () => {
    const user = new User({
      id: 1,
      name: 'John Doe'
    })

    const expected = {
      id: 1,
      name: 'John Doe',
      posts: []
    }

    expect(user.$toJson()).toEqual(expected)
    expect(user.posts.data).toStrictEqual([])
  })

  it('can create data when the has many relation is `[]`', async () => {
    const data = {
      id: 1,
      name: 'John Doe',
      posts: []
    }

    const user = new User(data)

    expect(user.$toJson()).toEqual(data)
    expect(user.posts.data).toStrictEqual([])
  })
})