import { reactive } from 'vue'
import { jsonApi, errorMessage } from '../api/http'

/*
 * JSONPlaceholder accepts POST / PUT / DELETE but does not persist them.
 * So every write is sent with axios (and must succeed), then mirrored in this
 * local store so the interface behaves like a real app.
 * Posts created here get ids above 100 and live only in this session ("local"),
 * so edits/deletes of those never hit the API (it would answer 500).
 */
const state = reactive({ list: [], loaded: false, loading: false, error: null })
let localId = 100

export function usePosts() {
  async function load(force = false) {
    if (state.loaded && !force) return
    state.loading = true
    state.error = null
    try {
      const { data } = await jsonApi.get('/posts')
      state.list = data
      state.loaded = true
    } catch (e) {
      state.error = errorMessage(e)
    } finally {
      state.loading = false
    }
  }

  // READ one: cache first, then the API. Throws on failure so the view can show an error state.
  async function getOne(id) {
    const n = Number(id)
    const cached = state.list.find((p) => p.id === n)
    if (cached) return cached
    const { data } = await jsonApi.get(`/posts/${n}`)
    return data
  }

  async function getComments(id) {
    if (Number(id) > 100) return []
    const { data } = await jsonApi.get(`/posts/${id}/comments`)
    return data
  }

  async function getByUser(userId) {
    const uid = Number(userId)
    const { data } = await jsonApi.get('/posts', { params: { userId: uid } })
    // hide posts the user deleted in this session, and add posts created in this session
    const remote = state.loaded ? data.filter((p) => state.list.some((x) => x.id === p.id)) : data
    const locals = state.list.filter((p) => p.local && p.userId === uid)
    return [...locals, ...remote]
  }

  // CREATE
  async function create({ title, body, userId }) {
    await jsonApi.post('/posts', { title, body, userId })
    const post = { id: ++localId, userId, title, body, local: true }
    state.list.unshift(post)
    return post
  }

  // UPDATE
  async function update(id, changes) {
    const n = Number(id)
    if (n <= 100) await jsonApi.put(`/posts/${n}`, { id: n, ...changes })
    const existing = state.list.find((p) => p.id === n)
    if (existing) Object.assign(existing, changes)
    return existing ?? { id: n, ...changes }
  }

  // DELETE
  async function remove(id) {
    const n = Number(id)
    if (n <= 100) await jsonApi.delete(`/posts/${n}`)
    const i = state.list.findIndex((p) => p.id === n)
    if (i !== -1) state.list.splice(i, 1)
  }

  return { state, load, getOne, getComments, getByUser, create, update, remove, errorMessage }
}
