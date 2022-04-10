import { axiosMock } from '../../setup'
import * as Data from './dummy/data'
import User from './dummy/models/User'

describe('Feature – Models – Delete', () => {
  describe('#static', () => {
    it('should delete a record', async () => {
      axiosMock.onDelete('http://localhost/users/1').reply(() => {
        return [200]
      })

      await User.api().delete(1)
    })
  })

  describe('#instance', () => {
    it('should delete a record', async () => {
      axiosMock.onDelete('http://localhost/users/1').reply(() => {
        return [200]
      })

      await new User(Data.User).$api().delete()
    })

    it('should throw an error when the record do not have an ID', () => {
      const error = () => {
        new User({ name: 'John Doe' }).$api().delete()
      }

      expect(error).toThrow('[ELOQJS] Cannot delete a model with no ID.')
    })
  })
})
