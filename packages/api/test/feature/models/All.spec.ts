import { assertInstanceOf, assertModels } from '@eloqjs/test-utils'

import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – All', () => {
  it('should fetch all records', async () => {
    axiosMock.onGet('http://localhost/users').reply(() => {
      return [200, Data.Users]
    })

    const users = await User.all().then((response) => response.data)

    assertInstanceOf(users, User)
    assertModels(users, Data.Users)
  })
})
