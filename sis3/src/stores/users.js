import { reactive } from 'vue'
import { jsonApi, errorMessage } from '../api/http'

const state = reactive({ list: [], loaded: false, loading: false, error: null })

export function useUsers() {
  async function load(force = false) {
    if (state.loaded && !force) return
    state.loading = true
    state.error = null
    try {
      const { data } = await jsonApi.get('/users')
      state.list = data
      state.loaded = true
    } catch (e) {
      state.error = errorMessage(e)
    } finally {
      state.loading = false
    }
  }

  const byId = (id) => state.list.find((u) => u.id === Number(id))
  const nameOf = (id) => byId(id)?.name ?? 'Unknown author'

  return { state, load, byId, nameOf }
}
