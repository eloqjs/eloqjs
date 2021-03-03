import {
  assertCollection,
  assertInstanceOf,
  assertModel
} from '@eloqjs/test-utils'

import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Query', () => {
  it('should begin query chain via static method', async () => {
    axiosMock.onGet('http://localhost/users').reply(() => {
      return [200, Data.Users]
    })

    const users = await User.all().then((response) => response.data)

    assertInstanceOf(users, User)
    assertCollection(users, Data.Users)
  })

  it('should begin query chain via instance method', async () => {
    axiosMock.onGet('http://localhost/users/1').reply(() => {
      return [200, Data.User]
    })

    const user = await new User()
      .$query()
      .find(1)
      .then((response) => response.data!)

    expect(user).toBeInstanceOf(User)
    assertModel(user, Data.User)
  })
})
