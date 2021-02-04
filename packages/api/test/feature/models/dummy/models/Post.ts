import { Relations } from '../../../../../src'
import BaseModel from '../../../../dummy/models/BaseModel'
import User from './User'

export default class Post extends BaseModel {
  static entity = 'posts'

  static primaryKey = 'slug'

  id!: number | null
  slug!: string
  title!: string
  posts!: Relations.HasOne<User>

  static fields() {
    return {
      id: this.attr(null),
      slug: this.string(''),
      title: this.string(''),
      user: this.hasOne(User)
    }
  }
}
