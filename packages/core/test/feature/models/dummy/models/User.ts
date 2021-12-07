import BaseModel from '../../../../dummy/models/BaseModel'

export default class User extends BaseModel {
  static entity = 'users'

  id!: number

  static fields() {
    return {
      id: {
        type: Number,
        nullable: true
      }
    }
  }
}
