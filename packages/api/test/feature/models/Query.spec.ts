import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Query', () => {
  it('should begin query chain via static method', async () => {
    axiosMock.onGet('http://localhost/users').reply(() => {
      return [200, Data.Users]
    })

    const users = await User.all().then((response) => response.data)

    for (const user of users) {
      const expected = Data.Users.find((record) => record.id === user.id)

      expect(user.$toJson()).toEqual(expected)
      expect(user).toBeInstanceOf(User)
    }
  })

  it('should begin query chain via instance method', async () => {
    axiosMock.onGet('http://localhost/users/1').reply(() => {
      return [200, Data.User]
    })

    const user = await new User()
      .$query()
      .find(1)
      .then((response) => response.data!)

    expect(user.$toJson()).toEqual(Data.User)
    expect(user).toBeInstanceOf(User)
  })
})
