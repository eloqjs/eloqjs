import { assertModel } from '@eloqjs/test-utils'

import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Feature – Models – Sync', () => {
  it('should update a new record via instance method', async () => {
    axiosMock
      .onPatch(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply((config) => {
        const data = JSON.parse(config.data)
        // TODO: Expect that only modified data was added to payload.
        // For now we can't deduce modified fields of relationships.
        const expected = {
          ...Data.Post,
          ...{
            user: {
              id: Data.Post.user.id
            }
          }
        }

        expect(data).toEqual(expected)

        return [200, Data.Post]
      })

    const post = await new User(Data.User)
      .$sync(new Post(Data.Post))
      .then((response) => response.data)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, Data.Post)
  })

  it('should update a new record via relation method', async () => {
    axiosMock
      .onPatch(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply((config) => {
        const data = JSON.parse(config.data)
        // TODO: Expect that only modified data was added to payload.
        // For now we can't deduce modified fields of relationships.
        const expected = {
          ...Data.Post,
          ...{
            user: {
              id: Data.Post.user.id
            }
          }
        }

        expect(data).toEqual(expected)

        return [200, Data.Post]
      })

    const post = await new User(Data.User).posts
      .sync(new Post(Data.Post))
      .then((response) => response.data)

    expect(post).toBeInstanceOf(Post)
    assertModel(post, Data.Post)
  })

  it('should throw an error when parent model do not have an ID', async () => {
    const error = () => {
      new User({ name: 'John Doe' }).posts.sync({
        title: 'My awesome post!'
      })
    }

    expect(error).toThrow(
      '[ELOQJS] Cannot sync a related model to a parent that has no ID.'
    )
  })

  it('should throw an error when relationship do not have an ID', () => {
    const error = () => {
      new User(Data.User).posts.sync({
        title: 'My awesome post!'
      })
    }

    expect(error).toThrow('[ELOQJS] Cannot sync a related model with no ID.')
  })
})
