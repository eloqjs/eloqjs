import BaseModel from '../../../../dummy/models/BaseModel'

export default class Product extends BaseModel {
  static entity = 'users'

  id!: number
  name!: string
  price!: number

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(''),
      price: this.number(null).nullable()
    }
  }
}
