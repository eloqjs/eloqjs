import { assertModel } from '@eloqjs/test-utils'

import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Feature – Models – Sync', () => {
  it('should update a new record via instance method', async () => {
    const expected = { ...Data.Post }
    expected.title = 'Updated Title'

    axiosMock
      .onPut(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply((config) => {
        const data = JSON.parse(config.data)
        const user = {
          id: Data.Post.user.id
        }

        expect(data).toEqual({ ...expected, user })

        return [200, expected]
      })

    const post = new Post(Data.Post)

    post.title = 'Updated Title'

    await new User(Data.User).$sync(post)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, expected)
  })

  it('should update a new record via instance method with a PATCH request', async () => {
    const expected = { ...Data.Post }
    expected.title = 'Updated Title'

    axiosMock
      .onPatch(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply((config) => {
        const data = JSON.parse(config.data)

        expect(data).toEqual({ title: expected.title })

        return [200, expected]
      })

    const post = new Post(Data.Post, null, { patch: true })

    post.title = 'Updated Title'

    await new User(Data.User).$sync(post)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, expected)
  })

  it('should update a new record via relation method', async () => {
    const expected = { ...Data.Post }
    expected.title = 'Updated Title'

    axiosMock
      .onPut(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply((config) => {
        const data = JSON.parse(config.data)
        const user = {
          id: Data.Post.user.id
        }

        expect(data).toEqual({ ...expected, user })

        return [200, expected]
      })

    const post = new Post(Data.Post)

    post.title = 'Updated Title'

    await new User(Data.User).posts.api().sync(post)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, expected)
  })

  it('should update a new record via relation method with a PATCH request', async () => {
    const expected = { ...Data.Post }
    expected.title = 'Updated Title'

    axiosMock
      .onPatch(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply((config) => {
        const data = JSON.parse(config.data)

        expect(data).toEqual({ title: expected.title })

        return [200, expected]
      })

    const post = new Post(Data.Post, null, { patch: true })

    post.title = 'Updated Title'

    await new User(Data.User).posts.api().sync(post)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, expected)
  })

  it('should throw an error when parent model do not have an ID', async () => {
    const error = () => {
      new User({ name: 'John Doe' }).posts.api().sync({
        title: 'My awesome post!'
      })
    }

    expect(error).toThrow(
      '[ELOQJS] Cannot sync a related model to a parent that has no ID.'
    )
  })

  it('should throw an error when relationship do not have an ID', () => {
    const error = () => {
      new User(Data.User).posts.api().sync({
        title: 'My awesome post!'
      })
    }

    expect(error).toThrow('[ELOQJS] Cannot sync a related model with no ID.')
  })
})
