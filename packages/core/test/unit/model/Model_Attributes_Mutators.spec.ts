import BaseModel from '../../dummy/models/BaseModel'

describe('Unit – Model - Attributes – Mutators', () => {
  it('should mutate data if closure was given to the attr when instantiating', () => {
    class User extends BaseModel {
      static entity = 'users'

      name!: string

      static fields() {
        return {
          name: this.attr('', (value) => value.toUpperCase())
        }
      }
    }

    expect(new User({ name: 'john doe' }).name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present', () => {
    class User extends BaseModel {
      static entity = 'users'

      name!: string

      static fields() {
        return {
          name: this.attr('')
        }
      }

      static mutators() {
        return {
          name(value: any) {
            return value.toUpperCase()
          }
        }
      }
    }

    expect(new User({ name: 'john doe' }).name).toBe('JOHN DOE')
  })

  it('attr mutator should take precedence over static mutators', () => {
    class User extends BaseModel {
      static entity = 'users'

      name!: string

      static fields() {
        return {
          name: this.attr('', (value) => value.toUpperCase())
        }
      }

      static mutators() {
        return {
          name() {
            return 'Not Expected'
          }
        }
      }
    }

    expect(new User({ name: 'john doe' }).name).toBe('JOHN DOE')
  })
})
