import { reactive } from 'vue'
import { jsonApi, errorMessage } from '../api/http'

// Same approach as posts: real axios calls, mirrored locally because the mock API does not persist.
const state = reactive({ list: [], loaded: false, loading: false, error: null })
let localId = 200

export function useTodos() {
  async function load(force = false) {
    if (state.loaded && !force) return
    state.loading = true
    state.error = null
    try {
      const { data } = await jsonApi.get('/todos', { params: { _limit: 20 } })
      state.list = data
      state.loaded = true
    } catch (e) {
      state.error = errorMessage(e)
    } finally {
      state.loading = false
    }
  }

  async function create(title, userId) {
    await jsonApi.post('/todos', { title, completed: false, userId })
    const todo = { id: ++localId, userId, title, completed: false, local: true }
    state.list.unshift(todo)
    return todo
  }

  async function update(todo, changes) {
    if (todo.id <= 200) await jsonApi.patch(`/todos/${todo.id}`, changes)
    Object.assign(todo, changes)
  }

  async function remove(todo) {
    if (todo.id <= 200) await jsonApi.delete(`/todos/${todo.id}`)
    const i = state.list.findIndex((t) => t.id === todo.id)
    if (i !== -1) state.list.splice(i, 1)
  }

  return { state, load, create, update, remove, errorMessage }
}
