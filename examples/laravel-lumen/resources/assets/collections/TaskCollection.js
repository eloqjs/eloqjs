import { Collection } from '@eloqjs/core'

import Task from '../models/Task'

export default class TaskCollection extends Collection {
  static get model() {
    return Task
  }

  /**
   * Returns the number of completed tasks (saved state).
   */
  get completed() {
    return this.sum((task) => task.$.done)
  }

  /**
   * Returns the percentage of completed tasks.
   */
  get progress() {
    if (this.isEmpty()) {
      return 0
    }

    return Math.round((this.completed / this.length) * 100)
  }
}
