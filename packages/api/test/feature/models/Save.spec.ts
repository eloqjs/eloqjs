import { assertModel } from '../../Helpers'
import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Save', () => {
  describe('#static', () => {
    it('should create a new record', async () => {
      axiosMock.onPost('http://localhost/users').reply(() => {
        return [200, Data.User]
      })

      const user = await User.save({
        name: 'John Doe'
      }).then((response) => response.data)

      expect(user).toBeInstanceOf(User)
      assertModel(user, Data.User)
    })

    it('should update a record by passing in the id', async () => {
      const expected = { ...Data.User }
      expected.name = 'Mary Doe'

      axiosMock.onPut('http://localhost/users/1').reply((config) => {
        const data = JSON.parse(config.data)

        expect(data).toEqual(expected)

        return [200, expected]
      })

      const user = await User.save({
        id: 1,
        name: 'Mary Doe'
      }).then((response) => response.data)

      expect(user).toBeInstanceOf(User)
      assertModel(user, expected)
    })
  })

  describe('#instance', () => {
    it('should create a new record', async () => {
      axiosMock.onPost('http://localhost/users').reply((config) => {
        const data = JSON.parse(config.data)
        const expected = {
          ...Data.User,
          id: null
        }

        expect(data).toEqual(expected)

        return [200, Data.User]
      })

      const user = await new User({
        name: 'John Doe'
      })
        .$save()
        .then((response) => response.data)

      expect(user).toBeInstanceOf(User)
      assertModel(user, Data.User)
    })

    it('should update a record by passing in the id', async () => {
      const expected = { ...Data.User }
      expected.name = 'Mary Doe'

      axiosMock.onPut('http://localhost/users/1').reply((config) => {
        const data = JSON.parse(config.data)

        expect(data).toEqual(expected)

        return [200, expected]
      })

      const user = new User({
        id: 1,
        name: 'Mary Doe'
      })

      await user.$save()

      expect(user).toBeInstanceOf(User)
      assertModel(user, expected)
    })

    it('should update a record by passing in the id with a PATCH request', async () => {
      const expected = { ...Data.User }
      expected.name = 'Mary Doe'

      axiosMock.onPatch('http://localhost/users/1').reply((config) => {
        const data = JSON.parse(config.data)

        expect(data).toEqual({ name: expected.name })

        return [200, expected]
      })

      const user = new User(Data.User, null, { patch: true })

      user.name = 'Mary Doe'

      await user.$save()

      expect(user).toBeInstanceOf(User)
      assertModel(user, expected)
    })
  })
})
