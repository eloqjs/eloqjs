import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Feature – Models – Detach', () => {
  it('should delete a record via instance method', async () => {
    axiosMock.onDelete(`http://localhost/users/1/posts/${Data.Post.slug}`).reply(() => {
      return [200]
    })

    await new User(Data.User).$detach(new Post(Data.Post))
  })

  it('should create a new record via relation method', async () => {
    axiosMock.onDelete(`http://localhost/users/1/posts/${Data.Post.slug}`).reply(() => {
      return [200]
    })

    await new User(Data.User).posts.api().detach(Data.Post.slug)
  })

  it('should throw an error when parent model do not have an ID', async () => {
    const error = () => {
      new User({ name: 'John Doe' }).posts.api().detach('my-awesome-post')
    }

    expect(error).toThrow('[ELOQJS] Cannot detach a related model from a parent that has no ID.')
  })

  it('should throw an error when relationship do not have an ID', () => {
    const error = () => {
      new User(Data.User).$detach(
        new Post({
          title: 'My awesome post!'
        })
      )
    }

    expect(error).toThrow('[ELOQJS] Cannot detach a related model with no ID.')
  })
})
