import { Collection, Relations } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'
import User from '../collections/dummy/models/User'

describe('Feature – Models – Clone', () => {
  it('should clone a model', () => {
    const user = new User({ id: 1 })
    const clone = user.$clone()

    expect(clone).not.toBe(user)
    expect(clone.$uid).not.toBe(user.$uid)
    expect(clone).toEqual(user)
  })

  it('should have the same options', () => {
    const user = new User({}, [], {
      foo: true
    })
    const clone = user.$clone()

    expect(clone.$getOption('foo')).toBe(user.$getOption('foo'))
  })

  it('should register to same collections', () => {
    const collection = new Collection()
    const user = new User({}, collection)

    const clone = user.$clone()

    expect(clone.$collections).toEqual(user.$collections)
  })

  it('should register the same hooks', () => {
    const user = new User({ id: 1 })

    user.$on('change', ({ model }) => {
      expect(model).toBe(clone)
    })

    const clone = user.$clone()
    clone.id = 2
  })

  it('should have the same references', () => {
    const user = new User({ id: 1 })

    user.id = 2

    const clone = user.$clone()

    expect(clone.id).toBe(user.id)
    expect(clone.$.id).toBe(user.$.id)
  })

  it('should have the same changes', () => {
    const user = new User({ id: 1 })

    user.id = 2

    user.$syncChanges()
    user.$syncReference()

    const clone = user.$clone()

    expect(clone.$getChanges()).toEqual(user.$getChanges())
  })

  it('should not modify the original', () => {
    const user = new User()

    user.id = 1

    const clone = user.$clone()

    clone.id = 2

    expect(user.id).toBe(1)
    expect(clone.id).toBe(2)
    expect(clone.$.id).toBe(user.$.id)
  })

  it('should have same relationship instance', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: number
      name!: string
      phone!: Relations.HasOne<Phone>
      posts!: Relations.HasMany<Post>

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          name: String,
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

      id!: number
      user_id!: number
      number!: number

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
          number: {
            type: Number,
            default: 0
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

    const user = new User({
      id: 1,
      name: 'John Doe',
      phone: { id: 1, user_id: 1, number: 123456789 },
      posts: [
        {
          id: 1,
          user_id: 1,
          slug: 'my-awesome-post',
          title: 'My awesome post!'
        },
        { id: 2, user_id: 1, slug: 'my-super-post', title: 'My super post!' }
      ]
    })
    const clone = user.$clone()

    expect(clone.phone.data).toBe(user.phone.data)
    expect(clone.posts.data).toBe(user.posts.data)
  })
})
