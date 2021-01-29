import { Relations } from '@eloqjs/core'
import Model from './Model'
import User from './User'

export default class Post extends Model {
  id!: number | null
  title!: string
  excerpt!: string
  text!: string
  image!: string
  publishedAt!: string
  slug!: string
  user!: Relations.HasOne<User>

  static entity = 'posts'

  static primaryKey = 'slug'

  static fields() {
    return {
      id: this.attr(null),
      title: this.string(''),
      excerpt: this.string(''),
      text: this.string(''),
      image: this.string(''),
      publishedAt: this.string(''),
      slug: this.string(''),
      user: this.hasOne(User)
    }
  }

  static mutators() {
    return {
      publishedAt(value: string) {
        return value ? new Date(value).toDateString() : value
      }
    }
  }
}
