import { Collection, HasMany } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'
import { assertInstanceOf, assertModel } from '../../Helpers'

describe('Features – Relations – Has Many', () => {
  class User extends BaseModel {
    static entity = 'users'

    id!: number
    name!: string
    posts!: HasMany<Post>

    static fields() {
      return {
        id: {
          type: Number,
          nullable: true
        },
        name: String,
        posts: {
          type: Post,
          relation: 'HasMany'
        }
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
        id: {
          type: Number,
          nullable: true
        },
        user_id: {
          type: Number,
          nullable: true
        },
        slug: String,
        title: String
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

    assertModel(user, data)
    assertInstanceOf(user.posts.data, Post)
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

    assertModel(user, expected)
    expect(user.posts.data).toBeInstanceOf(Collection)
    expect(user.posts.data.models).toStrictEqual([])
  })

  it('can create data when the has many relation is `[]`', async () => {
    const data = {
      id: 1,
      name: 'John Doe',
      posts: []
    }

    const user = new User(data)

    assertModel(user, data)
    expect(user.posts.data).toBeInstanceOf(Collection)
    expect(user.posts.data.models).toStrictEqual([])
  })
})
