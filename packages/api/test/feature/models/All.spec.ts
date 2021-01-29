import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – All', () => {
  it('should fetch all records', async () => {
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
})
