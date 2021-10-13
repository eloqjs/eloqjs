import { Collection } from '../../../src/collection/Collection'
import User from './dummy/models/User'

describe('Feature – Collections – Find', () => {
  const users = [
    new User({ id: 1, name: 'Joe Doe' }),
    new User({ id: 2, name: 'John Doe' }),
    new User({ id: 3, name: 'Alex Doe' }),
    new User({ id: 4, name: 'Mary Doe' })
  ]
  const collection = new Collection<User>(users)

  it('should find a model by its primary key', () => {
    expect(collection.find(3)).toBe(users[2])
  })

  it('should find multiple models by their primary keys', () => {
    expect(collection.find([2, 3, 4])).toEqual([users[1], users[2], users[3]])
  })

  it('should support a model predicate', () => {
    expect(collection.find(users[2])).toBe(users[2])
  })

  it('should support a closure predicate', () => {
    expect(collection.find((model) => model.name === 'Alex Doe')).toBe(users[2])
  })

  it('should return null when the model is not found', () => {
    expect(collection.find(5)).toBeNull()
  })

  it('should throw an error when an invalid predicate type was provided', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => collection.find(true)).toThrow(
      'Invalid type of `predicate` on `find`.'
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => collection.find({})).toThrow(
      'Invalid type of `predicate` on `find`.'
    )
  })
})
