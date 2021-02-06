<template>
  <div>
    <h1>Task List</h1>

    <!-- CREATE TASK -->
    <el-form>
      <el-form-item label="Name">
        <el-input v-model="task.name" ref="name" autofocus placeholder="Name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onCreate" :loading="task.saving">
          {{ createButtonText }}
        </el-button>
      </el-form-item>
    </el-form>

    <template v-if="tasks.length">
      <hr>

      <!-- TASK TABLE -->
      <table class="tasks">
        <thead>
        <th width="50"></th>
        <th>Name</th>
        <th width="200"></th>
        </thead>
        <tbody>
        <task v-for="task in tasks"
              :key="task.id"
              :task="task"
              @update="onUpdate(task)"
              @delete="onDelete(task)">
        </task>
        </tbody>
      </table>

      <!-- RESET BUTTON
      <div>
        <el-button
            type="info"
            icon="el-icon-back"
            size="small"
            @click="tasks.reset()">
          Reset
        </el-button>
      </div>
      <hr> -->

      <!-- PROGRESS -->
      <el-progress :percentage="progress" :status="status"></el-progress>
    </template>
  </div>
</template>

<script>
import Task from '../models/Task'
import _ from 'lodash'

export default {
  data () {
    return {
      tasks: [],
      // _tasks: [],
      // _task: new Task().$toJson(),
      task: new Task()
    }
  },

  async created () {
    this.tasks = await Task.all().then((response) => {
      this.$message.success('Fetched!')
      return response.data
    })
  },

  computed: {
    progress() {
      const completed = _.sum(this.tasks.map((task) => task.$.done))

      if (_.isEmpty(this.tasks)) {
        return 0
      }

      return _.round((completed / this.tasks.length) * 100)
    },

    status () {
      if (this.progress === 100) {
        return 'success'
      }
    },

    createButtonText () {
      return this.task.saving ? 'Creating...' : 'Create'
    },

    taskCollection() {
      return this.tasks
    }

    /*task: {
      get: function () {
        const task = this._task || {}
        return new Task(task)
      },
      set: function (record) {
        if (record instanceof Task) {
          record = record.$toJson()
        }

        this._task = record
      }
    },*/

    /*tasks: {
      get: function () {
        console.log('get', this._tasks)
        const tasks = this._tasks || []
        return this.$collect(tasks)
      },
      set: function (tasks) {
        this._tasks = tasks
        console.log('set', this._tasks)
      }
    }*/
  },

  methods: {
    async onCreate () {
      const task = await this.task.$save().then((response) => {
        this.task = new Task()
        this.$message.success('Task created successfully')
        return response.data
      }).catch((error) => {
        this.$message.error('Failed to create task!')
      })

      this.tasks.push(task)
    },
    async onDelete (task) {
      const index = this.tasks.findIndex((t) => t.id === task.id)

      await task.$delete().then(() => {
        this.$message.success('Task deleted successfully')
        this.$delete(this.tasks, index)
      }).catch((error) => {
        this.$message.error('Failed to delete task!')
      })
    },

    async onUpdate (task) {
      const index = this.tasks.findIndex((t) => t.id === task.id)

      const updatedTask = await task.$save().then((response) => {
        this.$message.success('Task saved successfully')
        return response.data
      }).catch((error) => {
        this.$message.error('Failed to save task!')
      })

      this.$set(this.tasks, index, updatedTask)
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  padding: 0;
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.tasks {
  margin-bottom: 20px;
  width: 100%;

  th {
    text-align: left;
  }
}

.buttons {
  text-align: right;
}
</style>
