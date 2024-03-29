import { assertModel } from '../../Helpers'
import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Feature – Models – Attach', () => {
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

    const post = await new User(Data.User)
      .$api()
      .attach(
        new Post({
          title: 'My awesome post!'
        })
      )
      .then((response) => response.data)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, Data.Post)
  })

  it('should create a new record via relation method', async () => {
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

    const post = await new User(Data.User).posts
      .api()
      .attach({
        title: 'My awesome post!'
      })
      .then((response) => response.data)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, Data.Post)
  })

  it('should throw an error when parent model do not have an ID', () => {
    const error = () => {
      new User({ name: 'John Doe' }).posts.api().attach({
        title: 'My awesome post!'
      })
    }

    expect(error).toThrow('[ELOQJS] Cannot attach a related model to a parent that has no ID.')
  })
})
