import { assertModel } from '../../Helpers'
import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – First', () => {
  it('should fetch all records, then get the first record of the collection', async () => {
    axiosMock.onGet('http://localhost/users').reply(() => {
      return [200, Data.Users]
    })

    const user = await User.first().then((response) => response.data!)

    expect(user).toBeInstanceOf(User)
    assertModel(user, Data.User)
  })

  it('should return null when no data was provided', async () => {
    axiosMock.onGet('http://localhost/users').reply(() => {
      return [200]
    })

    const user = await User.first().then((response) => response!.data)

    expect(user).toBeNull()
  })
})
