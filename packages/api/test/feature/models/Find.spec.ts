import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Find', () => {
  it('should fetch a record', async () => {
    axiosMock.onGet('http://localhost/users/1').reply(() => {
      return [200, Data.User]
    })

    const user = await User.find(1).then((response) => response.data!)

    expect(user.$toJson()).toEqual(Data.User)
    expect(user).toBeInstanceOf(User)
  })
})
