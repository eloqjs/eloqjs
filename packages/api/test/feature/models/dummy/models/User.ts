import BaseModel from '../../../../dummy/models/BaseModel'

export default class User extends BaseModel {
  static entity = 'users'

  id!: number | null
  name!: string

  static fields() {
    return {
      id: this.attr(null),
      name: this.string('')
    }
  }
}
