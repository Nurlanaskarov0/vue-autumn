<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../stores/posts'
import { useUsers } from '../stores/users'
import { useAuth } from '../stores/auth'
import { useToast } from '../stores/toast'
import { errorMessage } from '../api/http'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

// `id` arrives from the dynamic route /posts/:id (props: true)
const props = defineProps({ id: { type: String, required: true } })

const router = useRouter()
const posts = usePosts()
const users = useUsers()
const { isLoggedIn } = useAuth()
const toast = useToast()

const post = ref(null)
const comments = ref([])
const loading = ref(false)
const error = ref(null)
const deleting = ref(false)

const author = computed(() => (post.value ? users.byId(post.value.userId) : null))

async function load() {
  loading.value = true
  error.value = null
  post.value = null
  try {
    users.load()
    post.value = await posts.getOne(props.id)
    comments.value = await posts.getComments(props.id)
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

async function remove() {
  if (!window.confirm('Delete this post? This cannot be undone.')) return
  deleting.value = true
  try {
    await posts.remove(props.id)
    toast.push('Post deleted.', 'success')
    router.push({ name: 'posts' })
  } catch (e) {
    toast.push(errorMessage(e), 'error')
  } finally {
    deleting.value = false
  }
}

// Re-run when navigating from /posts/3 to /posts/4 (same component instance is reused)
watch(() => props.id, load, { immediate: true })
</script>

<template>
  <RouterLink class="back" to="/posts">Back to posts</RouterLink>

  <LoadingState v-if="loading" label="Opening post…" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <article v-else-if="post" class="article">
    <h1>{{ post.title }}</h1>
    <p class="article__meta">
      By
      <RouterLink :to="{ name: 'user-detail', params: { id: post.userId } }">
        {{ author?.name ?? 'Unknown author' }}
      </RouterLink>
      <span v-if="post.local" class="tag">new this session</span>
    </p>
    <p class="article__body">{{ post.body }}</p>

    <div v-if="isLoggedIn" class="actions">
      <RouterLink class="btn btn--ghost" :to="{ name: 'post-edit', params: { id: post.id } }">Edit post</RouterLink>
      <button class="btn btn--danger" type="button" :disabled="deleting" @click="remove">
        {{ deleting ? 'Deleting…' : 'Delete post' }}
      </button>
    </div>
    <p v-else class="muted">
      <RouterLink :to="{ name: 'login', query: { redirect: $route.fullPath } }">Sign in</RouterLink>
      to edit or delete posts.
    </p>

    <h2>Comments ({{ comments.length }})</h2>
    <p v-if="!comments.length" class="empty">No comments on this post yet.</p>
    <ul v-else class="comments">
      <li v-for="c in comments" :key="c.id" class="comment">
        <p>{{ c.body }}</p>
        <span class="comment__by">{{ c.name }} · {{ c.email }}</span>
      </li>
    </ul>

    <div class="actions">
      <RouterLink v-if="+id > 1" class="btn btn--ghost" :to="{ name: 'post-detail', params: { id: +id - 1 } }">Previous post</RouterLink>
      <RouterLink v-if="+id < 100" class="btn btn--ghost" :to="{ name: 'post-detail', params: { id: +id + 1 } }">Next post</RouterLink>
    </div>
  </article>
</template>
