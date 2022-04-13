import { HasMany } from '@eloqjs/core'
import Model from './Model'
import Post from './Post'

export default class User extends Model {
  id!: number
  firstName!: string
  lastName!: string
  email!: string
  avatar!: string | null
  posts!: HasMany<Post>

  static entity = 'users'

  static fields() {
    return {
      id: Number,
      firstName: String,
      lastName: String,
      email: String,
      avatar: {
        type: String,
        nullable: true
      },
      posts: {
        type: Post,
        relation: 'HasMany'
      }
    }
  }

  /**
   * Get full name of the user.
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
