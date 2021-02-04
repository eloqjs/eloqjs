import { Relations } from '../../../../../src'
import BaseModel from '../../../../dummy/models/BaseModel'
import Post from './Post'

export default class User extends BaseModel {
  static entity = 'users'

  id!: number | null
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
