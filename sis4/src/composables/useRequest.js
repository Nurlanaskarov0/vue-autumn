import { ref, onMounted, onBeforeUnmount } from 'vue'
import { errorMessage } from '../services/api'
export function useRequest(fetcher) {
  const data = ref(null), loading = ref(false), error = ref('')
  let controller
  async function reload() {
    controller?.abort()
    const request = new AbortController()
    controller = request
    loading.value = true
    error.value = ''
    try {
      const result = await fetcher(request.signal)
      if (!request.signal.aborted) data.value = result
    } catch (e) {
      if (!request.signal.aborted) error.value = errorMessage(e)
    } finally {
      if (!request.signal.aborted) loading.value = false
    }
  }
  onMounted(reload)
  onBeforeUnmount(() => controller?.abort())
  return { data, loading, error, reload }
}
