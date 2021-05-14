<template>
  <tr class="task" :class="{done: task.done}">
    <td>
      <el-checkbox v-model="task.done"></el-checkbox>
    </td>
    <td>
      <input class="name" v-model="task.name"></td>
    <td class="buttons">
      <el-button
          type="success"
          icon="el-icon-check"
          size="small"
          @click="onUpdate"
          :loading="task.$saving">{{ saveButtonText }}
      </el-button>
      <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="onDelete"
          :loading="task.$deleting">{{ deleteButtonText }}
      </el-button>
    </td>
  </tr>
</template>

<script>
import debounce from 'debounce'

export default {
  props: [
    'task'
  ],

  data () {
    return {
      isDirty: false,
      wasChanged: false
    }
  },

  computed: {
    deleteButtonText () {
      return this.task.$deleting ? 'Deleting...' : 'Delete'
    },

    saveButtonText () {
      return this.task.$saving ? 'Saving...' : 'Save'
    }
  },

  methods: {
    notifyChange( message, color) {
      const h = this.$createElement

      this.$notify({
        title: `[${this.task.$id}] - ${this.task.$.name}`,
        message: h('i', { style: `color: ${color}` }, message),
        duration: 2000
      })
    },

    async onDelete () {
      await this.task.$delete().then(() => {
        this.$message.success('Task deleted successfully')
      }).catch((error) => {
        this.$message.error('Failed to delete task!')
      })
    },

    async onUpdate () {
      await this.task.$save().then(() => {
        this.$message.success('Task saved successfully')
      }).catch((error) => {
        this.$message.error('Failed to save task!')
      })
    }
  },

  created() {
    // when the component has been created,
    // we replaced the original method with a debounced version
    this.notifyChange = debounce(this.notifyChange, 500)
  },

  watch: {
    task: {
      handler: function (task) {
        if (task.$isDirty() && !this.isDirty) {
          this.isDirty = true
          this.notifyChange('The task is now dirty', 'orange')
        }

        if (task.$isClean() && this.isDirty) {
          this.isDirty = false
          this.notifyChange('The task is now clean', 'green')
        }

        if (task.$wasChanged() && !this.wasChanged) {
          this.wasChanged = true
          this.notifyChange('The task was changed', 'cyan')
        }
      },
      deep: true
    }
  },
}
</script>

<style lang="scss" scoped>
input.name {
  border: none;
  padding: 10px 0;
  font-size: 1em;
  outline: none;
}

.buttons {
  text-align: right;
}
</style>
