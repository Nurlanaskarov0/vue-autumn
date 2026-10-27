import { reactive } from 'vue'

const state = reactive({ items: [] })
let nextId = 1

export function useToast() {
  function push(message, type = 'info') {
    const id = nextId++
    state.items.push({ id, message, type })
    setTimeout(() => dismiss(id), 3500)
  }
  function dismiss(id) {
    const i = state.items.findIndex((t) => t.id === id)
    if (i !== -1) state.items.splice(i, 1)
  }
  return { state, push, dismiss }
}
