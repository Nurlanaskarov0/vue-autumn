import { ref } from 'vue'
const overrides = ref({})
const storageError = ref('')
try {
  const saved = JSON.parse(localStorage.getItem('campus-task-status') || '{}')
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    overrides.value = Object.fromEntries(Object.entries(saved).filter(([,value]) => typeof value === 'boolean'))
  }
} catch { /* Unavailable or invalid storage must not prevent rendering. */ }
export function useTaskStatus() {
  const completed = task => overrides.value[task.id] ?? task.completed
  function toggle(task) {
    overrides.value = { ...overrides.value, [task.id]: !completed(task) }
    try {
      localStorage.setItem('campus-task-status', JSON.stringify(overrides.value))
      storageError.value = ''
    } catch {
      storageError.value = 'Changes are available for this session, but could not be saved on this device.'
    }
  }
  return { completed, toggle, storageError }
}
