import axios from 'axios'

// Public mock service #1: posts, users, comments, todos
export const jsonApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
})

// Public mock service #2: authentication
export const authApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
})

const TOKEN_KEY = 'harbor_auth'

// Attach the access token (if signed in) to every request
jsonApi.interceptors.request.use((config) => {
  try {
    const saved = JSON.parse(localStorage.getItem(TOKEN_KEY))
    if (saved?.token) config.headers.Authorization = `Bearer ${saved.token}`
  } catch {
    /* ignore corrupted storage */
  }
  return config
})

// Turn any axios error into a message a person can act on
export function errorMessage(error) {
  if (error?.code === 'ECONNABORTED') {
    return 'The request timed out. Check your connection and try again.'
  }
  if (!error?.response) {
    return 'Cannot reach the server. Check your connection and try again.'
  }
  if (error.response.status === 404) return 'We could not find that item.'
  return error.response.data?.message || `The server responded with status ${error.response.status}.`
}
