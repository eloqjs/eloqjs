import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Delete', () => {
  describe('#static', () => {
    it('should delete a record', async () => {
      axiosMock.onDelete('http://localhost/users/1').reply(() => {
        return [200]
      })

      const response = await User.delete(1)
      expect(response).toBeUndefined()
    })
  })

  describe('#instance', () => {
    it('should delete a record', async () => {
      axiosMock.onDelete('http://localhost/users/1').reply(() => {
        return [200]
      })

      const response = await new User(Data.User).$delete()
      expect(response).toBeUndefined()
    })

    it('should throw an error when the record do not have an ID', async () => {
      const error = () => {
        new User({ name: 'John Doe' }).$delete()
      }

      expect(error).toThrow('[ELOQJS] Cannot delete a model with no ID.')
    })
  })
})
