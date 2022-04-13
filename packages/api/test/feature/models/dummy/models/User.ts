import { HasMany } from '@eloqjs/core'

import BaseModel from '../../../../dummy/models/BaseModel'
import Post from './Post'

export default class User extends BaseModel {
  static entity = 'users'

  id!: number | null
  name!: string
  posts!: HasMany<Post>

  static fields() {
    return {
      id: {
        type: Number,
        nullable: true
      },
      name: String,
      posts: {
        type: Post,
        relation: 'HasMany'
      }
    }
  }
}
