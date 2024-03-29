import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model - Attributes – Boolean', () => {
  it('casts the value to `Boolean` when instantiating the model', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string | number
      bool!: boolean

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          bool: {
            type: Boolean,
            default: true,
            cast: true
          }
        }
      }
    }

    expect(new User({}).bool).toBe(true)
    expect(new User({ bool: '' }).bool).toBe(false)
    expect(new User({ bool: 'string' }).bool).toBe(true)
    expect(new User({ bool: '0' }).bool).toBe(true)
    expect(new User({ bool: 0 }).bool).toBe(false)
    expect(new User({ bool: 1 }).bool).toBe(true)
    expect(new User({ bool: true }).bool).toBe(true)
    // expect(new User({ bool: null }).bool).toBe(false)
  })

  it('can mutate the value by specifying mutator at attribute', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string | number
      bool!: boolean

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          bool: {
            type: Boolean,
            default: true,
            mutator: (value: any) => !value
          }
        }
      }
    }

    expect(new User({}).bool).toBe(false)
    expect(new User({ bool: '' }).bool).toBe(true)
    expect(new User({ bool: 'string' }).bool).toBe(false)
    expect(new User({ bool: '0' }).bool).toBe(false)
    expect(new User({ bool: 0 }).bool).toBe(true)
    expect(new User({ bool: 1 }).bool).toBe(false)
    expect(new User({ bool: true }).bool).toBe(false)
    expect(new User({ bool: null }).bool).toBe(true)
  })

  it('can mutate the value by specifying mutator at mutators', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string | number
      bool!: boolean

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          bool: {
            type: Boolean,
            default: true
          }
        }
      }

      static mutators() {
        return {
          bool(value: any) {
            return !value
          }
        }
      }
    }

    expect(new User({}).bool).toBe(false)
    expect(new User({ bool: '' }).bool).toBe(true)
    expect(new User({ bool: 'string' }).bool).toBe(false)
    expect(new User({ bool: '0' }).bool).toBe(false)
    expect(new User({ bool: 0 }).bool).toBe(true)
    expect(new User({ bool: 1 }).bool).toBe(false)
    expect(new User({ bool: true }).bool).toBe(false)
    expect(new User({ bool: null }).bool).toBe(true)
  })
})
