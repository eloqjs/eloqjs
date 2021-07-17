import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model - Attributes – String', () => {
  it('casts the value to `String` when instantiating the model', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string | number
      str!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          str: {
            type: String,
            default: 'default',
            cast: true
          }
        }
      }
    }

    expect(new User({}).str).toBe('default')
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe('1')
    expect(new User({ str: true }).str).toBe('true')
  })

  it('can mutate the value by specifying mutator at attribute', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string | number
      str!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          str: {
            type: String,
            default: 'default',
            cast: true,
            mutator: (value: any) => `${value} mutated`
          }
        }
      }
    }

    expect(new User({}).str).toBe('default mutated')
    expect(new User({ str: 'value' }).str).toBe('value mutated')
    expect(new User({ str: 1 }).str).toBe('1 mutated')
    expect(new User({ str: true }).str).toBe('true mutated')
  })

  it('can mutate the value by specifying mutator at mutators', () => {
    class User extends BaseModel {
      static entity = 'users'

      id!: string | number
      str!: string

      static fields() {
        return {
          id: {
            type: Number,
            nullable: true
          },
          str: {
            type: String,
            default: 'default',
            cast: true
          }
        }
      }

      static mutators() {
        return {
          str(value: any) {
            return `${value} mutated`
          }
        }
      }
    }

    expect(new User({}).str).toBe('default mutated')
    expect(new User({ str: 'value' }).str).toBe('value mutated')
    expect(new User({ str: 1 }).str).toBe('1 mutated')
    expect(new User({ str: true }).str).toBe('true mutated')
  })
})
