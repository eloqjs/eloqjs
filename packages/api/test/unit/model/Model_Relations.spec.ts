import { Relations } from '@eloqjs/core'

import BaseModel from '../../dummy/models/BaseModel'
import Post from '../../feature/models/dummy/models/Post'

describe('Unit - Model – Relations', () => {
  it('should throw an error when performing operations for a non-registered relationship', () => {
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
      userId!: number

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          userId: {
            type: Number,
            nullable: true
          }
        }
      }
    }

    const error = '[ELOQJS] The User model does not have a relationship with the Post model.'

    const user = new User({ id: 1, name: 'John Doe' })
    const post = new Post({
      id: 1,
      slug: 'my-awesome-post',
      title: 'My awesome post!'
    })

    expect(() => user.$attach(post)).toThrow(error)
    expect(() => user.$detach(post)).toThrow(error)
    expect(() => user.$sync(post)).toThrow(error)
    expect(() => post.$for(user)).toThrow(error)
  })
})
