import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Fresh', () => {
  // eslint-disable-next-line no-console
  const consoleLog = console.log

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.log = jest.fn()
  })

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.log = consoleLog
  })

  it('should re-fetch a record', async () => {
    axiosMock.onGet('http://localhost/users/1').reply(() => {
      return [200, Data.User]
    })

    const user = await new User({ id: 1 }).$fresh()

    expect(user!.$toJson()).toEqual(Data.User)
    expect(user!).toBeInstanceOf(User)
  })

  it('should return null when failed', async () => {
    // eslint-disable-next-line no-console
    console.error = jest.fn()

    axiosMock.onGet('http://localhost/users/2').reply(() => {
      return [404]
    })

    const user1 = await new User().$fresh()
    const user2 = await new User({ id: 1 }).$fresh()

    expect(user1).toBeNull()
    expect(user2).toBeNull()

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled()
  })
})
