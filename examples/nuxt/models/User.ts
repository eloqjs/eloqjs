import { Relations } from '@eloqjs/core'
import Model from './Model'
import Post from './Post'

export default class User extends Model {
  id!: number | null
  firstName!: string
  lastName!: string
  email!: string
  avatar!: string
  posts!: Relations.HasMany<Post>

  static entity = 'users'

  static fields() {
    return {
      id: this.attr(null),
      firstName: this.string(''),
      lastName: this.string(''),
      email: this.string(''),
      avatar: this.string(''),
      posts: this.hasMany(Post)
    }
  }

  /**
   * Get full name of the user.
   */
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
