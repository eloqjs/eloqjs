import { Collection } from '../../../src/collection/Collection'
import User from '../../feature/collections/dummy/models/User'

describe('Unit - Model – Collections', () => {
  it('can register a collection on initialize', () => {
    const collection = new Collection<User>()
    const user = new User({}, collection)

    expect(user.$collections).toEqual([collection])
  })

  it('can register an array of collections on initialize', () => {
    const collection1 = new Collection<User>()
    const collection2 = new Collection<User>()
    const user = new User({}, [collection1, collection2])

    expect(user.$collections).toEqual([collection1, collection2])
  })

  it('should quietly not allow registering an undefined collection', () => {
    const user = new User({}, undefined)
    expect(user.$collections).toEqual([])
  })

  it('should quietly not allow registering a null collection', () => {
    const user = new User({}, null)
    expect(user.$collections).toEqual([])
  })
})
