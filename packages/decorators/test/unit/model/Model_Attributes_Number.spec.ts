import { Attr, Num } from '../../../src'
import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model - Attributes – Number', () => {
  it('casts the value to `Number` when instantiating the model', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: string | number

      @Num(0)
      num!: boolean
    }

    expect(new User({}).num).toBe(0)
    expect(new User({ num: 1 }).num).toBe(1)
    expect(new User({ num: '2' }).num).toBe(2)
    expect(new User({ num: true }).num).toBe(1)
    expect(new User({ num: false }).num).toBe(0)
    expect(new User({ num: null }).num).toBe(0)
  })

  it('can mutate the value by specifying mutator at mutators', () => {
    class User extends BaseModel {
      static entity = 'users'

      @Attr(null)
      id!: string | number

      @Num(0)
      num!: boolean

      static mutators() {
        return {
          num(value: any) {
            return value + 1
          }
        }
      }
    }

    expect(new User({}).num).toBe(1)
    expect(new User({ num: 1 }).num).toBe(2)
    expect(new User({ num: '2' }).num).toBe(3)
    expect(new User({ num: true }).num).toBe(2)
    expect(new User({ num: false }).num).toBe(1)
    expect(new User({ num: null }).num).toBe(1)
  })
})
