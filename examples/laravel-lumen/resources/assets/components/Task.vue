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
          @click="$emit('update')">{{ saveButtonText }}
      </el-button>
      <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click="$emit('delete')">{{ deleteButtonText }}
      </el-button>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'task'
  ],

  computed: {
    deleteButtonText () {
      return this.task.deleting ? 'Deleting...' : 'Delete'
    },

    saveButtonText () {
      return this.task.saving ? 'Saving...' : 'Save'
    }
  }
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
