import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import Post from './dummy/models/Post'
import User from './dummy/models/User'

describe('Feature – Models – Detach', () => {
  it('should delete a record via instance method', async () => {
    axiosMock
      .onDelete(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply(() => {
        return [200]
      })

    const response = await new User(Data.User).$detach(new Post(Data.Post))
    expect(response).toBeUndefined()
  })

  it('should create a new record via relation method', async () => {
    axiosMock
      .onDelete(`http://localhost/users/1/posts/${Data.Post.slug}`)
      .reply(() => {
        return [200]
      })

    const response = await new User(Data.User).posts.detach(Data.Post.slug)
    expect(response).toBeUndefined()
  })
})
