<script>
export default {
  name: 'TaskForm',
  emits: ['add'], // custom event
  data() {
    return { title: '', description: '', priority: 'medium', error: '' }
  },
  watch: {
    // когда пользователь начинает печатать, убираем ошибку
    title(value) {
      if (value.trim()) this.error = ''
    }
  },
  methods: {
    submit() {
      if (!this.title.trim()) {
        this.error = 'Enter a title'
        return
      }
      // отправляем новую задачу родителю
      this.$emit('add', {
        title: this.title,
        description: this.description,
        priority: this.priority
      })
      this.title = ''
      this.description = ''
      this.priority = 'medium'
    }
  }
}
</script>

<template>
  <BaseCard>
    <template #header>New task</template>
    <form @submit.prevent="submit">
      <input v-model="title" placeholder="Title" />
      <br /><br />
      <textarea v-model="description" placeholder="Description"></textarea>
      <br /><br />
      <select v-model="priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <BaseButton type="submit">Add</BaseButton>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </BaseCard>
</template>
