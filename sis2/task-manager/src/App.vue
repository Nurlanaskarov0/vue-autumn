<script>
import TaskForm from './components/TaskForm.vue'
import TaskItem from './components/TaskItem.vue'
import TaskStats from './components/TaskStats.vue'

export default {
  name: 'App',
  components: { TaskForm, TaskItem, TaskStats },
  data() {
    return {
      tasks: [],
      search: '',
      statusFilter: 'all',
      priorityFilter: 'all'
    }
  },
  computed: {
    // список после поиска и фильтров
    filteredTasks() {
      return this.tasks.filter((task) => {
        const okSearch = task.title.toLowerCase().includes(this.search.toLowerCase())
        const okStatus = this.statusFilter === 'all' || task.status === this.statusFilter
        const okPriority = this.priorityFilter === 'all' || task.priority === this.priorityFilter
        return okSearch && okStatus && okPriority
      })
    },
    totalCount() {
      return this.tasks.length
    },
    activeCount() {
      return this.tasks.filter((task) => task.status === 'active').length
    },
    completedCount() {
      return this.tasks.filter((task) => task.status === 'completed').length
    }
  },
  watch: {
    // при любом изменении задач сохраняем их в localStorage
    tasks: {
      handler(newTasks) {
        localStorage.setItem('tasks', JSON.stringify(newTasks))
      },
      deep: true
    }
  },
  // хук жизненного цикла 1
  created() {
    console.log('App created')
  },
  // хук жизненного цикла 2: загружаем сохранённые задачи
  mounted() {
    const saved = localStorage.getItem('tasks')
    if (saved) {
      this.tasks = JSON.parse(saved)
    }
  },
  methods: {
    addTask(newTask) {
      this.tasks.push({
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'active',
        createdAt: new Date().toISOString()
      })
    },
    toggleTask(id) {
      const task = this.tasks.find((t) => t.id === id)
      task.status = task.status === 'active' ? 'completed' : 'active'
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id)
    },
    updateTask(id, title, description) {
      const task = this.tasks.find((t) => t.id === id)
      task.title = title
      task.description = description
    },
    changePriority(id, priority) {
      const task = this.tasks.find((t) => t.id === id)
      task.priority = priority
    }
  }
}
</script>

<template>
  <div class="app">
    <h1>Task Manager</h1>

    <TaskStats :total="totalCount" :active="activeCount" :completed="completedCount" />

    <TaskForm @add="addTask" />

    <BaseCard>
      <template #header>Tasks</template>

      <input v-model="search" placeholder="Search by title" />
      <select v-model="statusFilter">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="priorityFilter">
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <ul>
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @delete="deleteTask"
          @update="updateTask"
          @change-priority="changePriority"
        />
      </ul>
      <p v-if="filteredTasks.length === 0">No tasks found</p>
    </BaseCard>
  </div>
</template>
