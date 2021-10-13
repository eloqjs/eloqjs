import BaseModel from '../../../../dummy/models/BaseModel'

export default class User extends BaseModel {
  static entity = 'users'

  id!: number
  name!: string

  static fields() {
    return {
      id: {
        type: Number,
        nullable: true
      },
      name: String
    }
  }
}
