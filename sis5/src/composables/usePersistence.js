import { watch, onScopeDispose } from 'vue'
import { useTaskStore } from '../stores/tasks'
export function usePersistence() {
  const store=useTaskStore()
  let storage
  try {storage=window.localStorage} catch {storage={getItem(){throw new Error('Unavailable')},setItem(){throw new Error('Unavailable')}}}
  store.initialize(storage)
  // Watch tasks only: filtering must not overwrite saved data after a load error.
  const stop=watch(()=>store.tasks,()=>store.persist(storage),{deep:true,flush:'sync'})
  onScopeDispose(stop)
}
