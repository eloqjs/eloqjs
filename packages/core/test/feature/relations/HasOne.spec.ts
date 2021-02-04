import { Relations } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Features – Relations – Has One', () => {
  class User extends BaseModel {
    static entity = 'users'

    id!: number
    name!: string
    phone!: Relations.HasOne<Phone>

    static fields() {
      return {
        id: this.attr(null),
        name: this.string(''),
        phone: this.hasOne(Phone)
      }
    }
  }

  class Phone extends BaseModel {
    static entity = 'phones'

    id!: number
    user_id!: number
    number!: number

    static fields() {
      return {
        id: this.attr(null),
        user_id: this.attr(null),
        number: this.number(0)
      }
    }
  }

  it('can create data containing the has one relation', async () => {
    const data = {
      id: 1,
      name: 'John Doe',
      phone: { id: 1, user_id: 1, number: 123456789 }
    }
    const user = new User(data)

    expect(user.$toJson()).toEqual(data)
    expect(user.phone.data).toBeInstanceOf(Phone)
  })

  it('can create data when the has one relation is empty', async () => {
    const user = new User({
      id: 1,
      name: 'John Doe'
    })

    const expected = {
      id: 1,
      name: 'John Doe',
      phone: null
    }

    expect(user.$toJson()).toEqual(expected)
    expect(user.phone.data).toBeNull()
  })

  it('can create data when the has one relation is `null`', async () => {
    const data = {
      id: 1,
      name: 'John Doe',
      phone: null
    }

    const user = new User(data)

    expect(user.$toJson()).toEqual(data)
    expect(user.phone.data).toBeNull()
  })
})
