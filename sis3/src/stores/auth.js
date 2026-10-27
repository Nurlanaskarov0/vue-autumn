import { reactive, computed } from 'vue'
import { authApi, errorMessage } from '../api/http'

const KEY = 'harbor_auth'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

const state = reactive({ user: load(), loading: false, error: null })

export function useAuth() {
  const isLoggedIn = computed(() => !!state.user?.token)
  const fullName = computed(() =>
    state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  )
  // JSONPlaceholder only has users 1–10, so map the signed-in account onto one of them
  const boardUserId = computed(() => (state.user ? ((state.user.id - 1) % 10) + 1 : null))

  async function login(username, password) {
    state.loading = true
    state.error = null
    try {
      const { data } = await authApi.post('/auth/login', {
        username,
        password,
        expiresInMins: 60,
      })
      state.user = {
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        image: data.image,
        token: data.accessToken ?? data.token,
      }
      localStorage.setItem(KEY, JSON.stringify(state.user))
      return true
    } catch (e) {
      state.error =
        e.response?.status === 400
          ? 'Wrong username or password. Check both and try again.'
          : errorMessage(e)
      return false
    } finally {
      state.loading = false
    }
  }

  function logout() {
    state.user = null
    localStorage.removeItem(KEY)
  }

  return { state, isLoggedIn, fullName, boardUserId, login, logout }
}
