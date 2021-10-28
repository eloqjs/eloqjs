import { Model as BaseModel } from '@eloqjs/core'

export default class Model extends BaseModel {
  static options() {
    return {
      dataKey: 'data'
    }
  }
}
