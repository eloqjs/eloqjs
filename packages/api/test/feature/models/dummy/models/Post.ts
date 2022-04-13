import { HasOne } from '@eloqjs/core'

import BaseModel from '../../../../dummy/models/BaseModel'
import User from './User'

export default class Post extends BaseModel {
  static entity = 'posts'

  static primaryKey = 'slug'

  id!: number | null
  slug!: string
  title!: string
  posts!: HasOne<User>

  static fields() {
    return {
      id: {
        type: Number,
        nullable: true
      },
      slug: {
        type: String,
        default: ''
      },
      title: String,
      user: {
        type: User,
        relation: 'HasOne'
      }
    }
  }
}
