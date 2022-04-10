import { assertModel } from '../../Helpers'
import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Feature – Models – For', () => {
  it('should create a new record via instance method', async () => {
    axiosMock.onPost('http://localhost/users/1/posts').reply((config) => {
      const data = JSON.parse(config.data)

      expect(data).toEqual({
        id: null,
        slug: '',
        title: 'My awesome post!',
        user: null
      })

      return [200, Data.Post]
    })
    const user = new User(Data.User)
    const post = await new Post({
      title: 'My awesome post!'
    })
      .$api()
      .for(user)
      .then((response) => response.data)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, Data.Post)
  })

  it('should throw an error when parent model do not have an ID', async () => {
    const error = () => {
      const user = new User({ name: 'John Doe' })
      new Post({
        title: 'My awesome post!'
      })
        .$api()
        .for(user)
    }

    expect(error).toThrow('[ELOQJS] Cannot attach a related model to a parent that has no ID.')
  })
})
