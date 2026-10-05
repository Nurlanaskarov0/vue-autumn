<script>
export default {
  name: 'TaskItem',
  props: {
    task: { type: Object, required: true }
  },
  // события, которые отправляем в App.vue
  emits: ['toggle', 'delete', 'update', 'change-priority'],
  data() {
    return { editing: false, newTitle: '', newDescription: '' }
  },
  computed: {
    isCompleted() {
      return this.task.status === 'completed'
    }
  },
  methods: {
    startEdit() {
      this.newTitle = this.task.title
      this.newDescription = this.task.description
      this.editing = true
    },
    saveEdit() {
      if (!this.newTitle.trim()) return
      this.$emit('update', this.task.id, this.newTitle, this.newDescription)
      this.editing = false
    },
    changePriority(event) {
      this.$emit('change-priority', this.task.id, event.target.value)
    }
  }
}
</script>

<template>
  <li class="task">
    <div v-if="!editing">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <p>Created: {{ new Date(task.createdAt).toLocaleDateString() }}</p>
      <p>Status: {{ task.status }}</p>
    </div>

    <div v-else>
      <input v-model="newTitle" />
      <br /><br />
      <textarea v-model="newDescription"></textarea>
    </div>

    <p>
      Priority:
      <select :value="task.priority" @change="changePriority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </p>

    <div v-if="!editing">
      <BaseButton @click="$emit('toggle', task.id)">
        {{ isCompleted ? 'Reopen' : 'Complete' }}
      </BaseButton>
      <BaseButton @click="startEdit">Edit</BaseButton>
      <BaseButton @click="$emit('delete', task.id)">Delete</BaseButton>
    </div>
    <div v-else>
      <BaseButton @click="saveEdit">Save</BaseButton>
      <BaseButton @click="editing = false">Cancel</BaseButton>
    </div>
  </li>
</template>
