import { Collection, Relations } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'
import { assertCollection } from '../../Helpers'
import User from './dummy/models/User'

describe('Feature – Collections – Clone', () => {
  it('should clone the collection', () => {
    const collection = new Collection()
    const cloned = collection.clone()

    expect(cloned).not.toBe(collection)
  })

  it('should preserve the models', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    const cloned = collection.clone()

    added.forEach((model, index) => {
      expect(cloned.models[index]).toBe(model)
    })
  })

  it('should preserve the options', () => {
    const collection = new Collection<User>([], {
      model: User
    })
    const cloned = collection.clone()

    const added = cloned.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    assertCollection(cloned, added)
  })

  it('should clone extended collection', () => {
    class UserCollection extends Collection<User> {
      static model = User
    }

    const collection = new UserCollection()
    const cloned = collection.clone()

    expect(cloned).not.toBe(collection)
  })

  it('should preserve the models of extended collection', () => {
    class UserCollection extends Collection<User> {
      static model = User
    }

    const collection = new UserCollection()

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    const cloned = collection.clone()

    assertCollection(cloned, added)
  })

  it('should clone models when `deep` option is enabled', () => {
    const collection = new Collection<User>([], {
      model: User
    })

    const added = collection.add([
      { id: 1, name: 'Joe Doe' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Doe' }
    ])

    const cloned = collection.clone({ deep: true })

    added.forEach((user, index) => {
      const clone = cloned.models[index]
      expect(clone).not.toBe(user)
      expect(clone.$serialize()).toEqual(user.$serialize())
    })
  })

  it('should clone models and their relationships when `deep` option is enabled and `deepLevel` is 2', () => {
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

    const collection = new Collection<User>([], {
      model: User
    })

    const added = collection.add([
      {
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
      }
    ])

    const cloned = collection.clone({ deep: true, deepLevel: 2 })

    added.forEach((user, index) => {
      const clone = cloned.models[index]

      expect(clone).not.toBe(user)
      expect(clone.phone.data).not.toBe(user.phone.data)
      expect(clone.posts.data).not.toBe(user.posts.data)
      expect(clone.phone.data!.$serialize()).toEqual(user.phone.data!.$serialize())
      expect(clone.posts.data.models.map((model) => model.$serialize())).toEqual(
        user.posts.data.models.map((model) => model.$serialize())
      )
      expect(clone.$serialize()).toEqual(user.$serialize())
    })
  })
})
