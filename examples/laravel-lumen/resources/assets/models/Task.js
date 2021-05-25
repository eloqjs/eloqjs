import { Model } from '@eloqjs/api'

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
      id: this.attr(null),
      name: this.string(''),
      done: this.boolean(false)
    }
  }
}
