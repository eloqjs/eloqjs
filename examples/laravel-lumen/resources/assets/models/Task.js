import { Model } from '@eloqjs/core'

export default class Task extends Model {
  static get entity() {
    return 'tasks'
  }

  static get resource() {
    return 'task'
  }

  static options() {
    return {
      patch: true
    }
  }

  static fields() {
    return {
      id: Number,
      name: String,
      done: {
        type: Boolean,
        default: false
      }
    }
  }
}
