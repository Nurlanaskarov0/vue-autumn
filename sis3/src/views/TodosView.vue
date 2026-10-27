<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useTodos } from '../stores/todos'
import { useAuth } from '../stores/auth'
import { useToast } from '../stores/toast'
import { errorMessage } from '../api/http'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const todos = useTodos()
const { boardUserId } = useAuth()
const toast = useToast()

const newTitle = ref('')
const adding = ref(false)
const filter = ref('all')
const editingId = ref(null)
const editTitle = ref('')
const editInput = ref(null)

const visible = computed(() =>
  todos.state.list.filter((t) =>
    filter.value === 'all' ? true : filter.value === 'done' ? t.completed : !t.completed,
  ),
)
const openCount = computed(() => todos.state.list.filter((t) => !t.completed).length)

async function run(action, successMessage) {
  try {
    await action()
    if (successMessage) toast.push(successMessage, 'success')
  } catch (e) {
    toast.push(errorMessage(e), 'error')
  }
}

async function add() {
  const title = newTitle.value.trim()
  if (title.length < 3) {
    toast.push('Write at least 3 characters for the task.', 'error')
    return
  }
  adding.value = true
  await run(() => todos.create(title, boardUserId.value), 'Task added.')
  newTitle.value = ''
  adding.value = false
}

const toggle = (t) => run(() => todos.update(t, { completed: !t.completed }))
const remove = (t) => run(() => todos.remove(t), 'Task deleted.')

async function startEdit(t) {
  editingId.value = t.id
  editTitle.value = t.title
  await nextTick()
  editInput.value?.[0]?.focus()
}
async function saveEdit(t) {
  if (editingId.value !== t.id) return // already saved (Enter fires blur too)
  const title = editTitle.value.trim()
  editingId.value = null
  if (title.length < 3 || title === t.title) return
  await run(() => todos.update(t, { title }), 'Task saved.')
}

onMounted(() => todos.load())
</script>

<template>
  <h1>My tasks</h1>
  <p class="muted">{{ openCount }} still to do</p>

  <form class="add-task" @submit.prevent="add">
    <label class="sr" for="new-task" style="position:absolute;left:-9999px">New task</label>
    <input id="new-task" v-model="newTitle" type="text" placeholder="What needs doing?" autocomplete="off" />
    <button class="btn" type="submit" :disabled="adding">{{ adding ? 'Adding…' : 'Add task' }}</button>
  </form>

  <div class="tabs" role="group" aria-label="Filter tasks">
    <button v-for="f in ['all', 'open', 'done']" :key="f" class="btn btn--ghost btn--sm" type="button" :aria-pressed="filter === f" @click="filter = f">
      {{ f === 'all' ? 'All' : f === 'open' ? 'To do' : 'Done' }}
    </button>
  </div>

  <LoadingState v-if="todos.state.loading" label="Fetching tasks…" />
  <ErrorState v-else-if="todos.state.error" :message="todos.state.error" @retry="todos.load(true)" />
  <template v-else>
    <p v-if="!visible.length" class="empty">Nothing here. Add a task above to get started.</p>
    <ul v-else class="tasks">
      <li v-for="t in visible" :key="t.id" class="task" :class="{ 'task--done': t.completed }">
        <input type="checkbox" :checked="t.completed" :aria-label="`Mark “${t.title}” as ${t.completed ? 'to do' : 'done'}`" @change="toggle(t)" />
        <template v-if="editingId === t.id">
          <input ref="editInput" v-model="editTitle" class="task__edit" @keyup.enter="saveEdit(t)" @keyup.esc="editingId = null" @blur="saveEdit(t)" />
        </template>
        <template v-else>
          <span class="task__title">{{ t.title }}</span>
          <button class="btn btn--ghost btn--sm" type="button" @click="startEdit(t)">Edit</button>
          <button class="btn btn--danger btn--sm" type="button" @click="remove(t)">Delete</button>
        </template>
      </li>
    </ul>
  </template>
</template>
