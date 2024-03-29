import { assertModel } from '../../Helpers'
import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Find', () => {
  it('should fetch a record', async () => {
    axiosMock.onGet('http://localhost/users/1').reply(() => {
      return [200, Data.User]
    })

    const user = await User.api()
      .find(1)
      .then((response) => response.data!)

    expect(user).toBeInstanceOf(User)
    assertModel(user, Data.User)
  })

  it('should return null when no data was provided', async () => {
    axiosMock.onGet('http://localhost/users/1').reply(() => {
      return [200]
    })

    const user = await User.api()
      .find(1)
      .then((response) => response!.data)

    expect(user).toBeNull()
  })
})
