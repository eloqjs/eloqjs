import BaseModel from '../../../../dummy/models/BaseModel'

export default class Product extends BaseModel {
  static entity = 'users'

  id!: number
  name!: string
  price!: number
  manufacturer!: string

  static fields() {
    return {
      id: {
        type: Number,
        nullable: true
      },
      name: String,
      price: {
        type: [Number, String],
        nullable: true
      },
      manufacturer: {
        type: String,
        nullable: true
      }
    }
  }
}
