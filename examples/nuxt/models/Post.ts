import { HasOne } from '@eloqjs/core'
import Model from './Model'
import User from './User'

export default class Post extends Model {
  id!: number
  title!: string
  excerpt!: string | null
  text!: string | null
  image!: string | null
  publishedAt!: string | null
  slug!: string
  user!: HasOne<User>

  static entity = 'posts'

  static primaryKey = 'slug'

  static fields() {
    return {
      id: Number,
      title: String,
      excerpt: {
        type: String,
        nullable: true
      },
      text: {
        type: String,
        nullable: true
      },
      image: {
        type: String,
        nullable: true
      },
      publishedAt: {
        type: Date,
        cast: true,
        nullable: true
      },
      slug: String,
      user: {
        type: User,
        relation: 'HasOne'
      }
    }
  }

  // static mutators() {
  //   return {
  //     publishedAt(value: string) {
  //       return value ? new Date(value).toDateString() : value
  //     }
  //   }
  // }
}
