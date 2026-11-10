import axios from 'axios'
export const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com', timeout: 12000 })
export function errorMessage(error) {
  if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
  return error.response ? `The server returned an error (${error.response.status}). Please try again.` : 'Unable to connect. Check your internet connection and try again.'
}
