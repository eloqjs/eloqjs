import { Relations } from '@eloqjs/core'

import { Attr, HasMany, HasOne } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model - Serialization', () => {
  it('can serialize own fields into json', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @Attr('')
      name!: string
    }

    const user = new User({ id: 1, name: 'John Doe' })

    const json = user.$toJson()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({ id: 1, name: 'John Doe' })
  })

  it('can serialize nested fields into json', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: number

      @HasOne(() => Phone)
      phone!: Relations.HasOne<Phone>

      @HasMany(() => Post)
      posts!: Relations.HasMany<Post>
    }

    class Phone extends BaseModel {
      static entity = 'phones'

      @Attr(null)
      id!: number

      @Attr(null)
      user_id!: number
    }

    class Post extends BaseModel {
      static entity = 'posts'

      @Attr(null)
      id!: number

      @Attr(null)
      user_id!: number
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

      @Attr(null)
      id!: number

      @HasOne(() => Phone)
      phone!: Relations.HasOne<Phone>
    }

    class Phone extends BaseModel {
      static entity = 'phones'

      @Attr(null)
      id!: number

      @Attr(null)
      user_id!: number
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

      @Attr(null)
      id!: number

      @Attr([])
      array!: any[]
    }

    const user = new User({ id: 1, array: [1, 2] })

    const json = user.$toJson()

    expect(json).not.toBeInstanceOf(User)
    expect(json).toEqual({ id: 1, array: [1, 2] })
  })
})
