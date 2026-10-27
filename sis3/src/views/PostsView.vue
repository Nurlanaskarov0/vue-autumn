<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePosts } from '../stores/posts'
import { useUsers } from '../stores/users'
import PostRow from '../components/PostRow.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const posts = usePosts()
const users = useUsers()

const query = ref('')
const author = ref('')
const visible = ref(15)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return posts.state.list.filter(
    (p) =>
      (!author.value || p.userId === Number(author.value)) &&
      (!q || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)),
  )
})
const shown = computed(() => filtered.value.slice(0, visible.value))

watch([query, author], () => (visible.value = 15))

function load(force = false) {
  posts.load(force)
  users.load(force)
}
onMounted(() => load())
</script>

<template>
  <div class="actions" style="justify-content: space-between; align-items: end">
    <h1>Posts</h1>
    <RouterLink class="btn" :to="{ name: 'post-new' }">Write a post</RouterLink>
  </div>

  <div class="toolbar">
    <input v-model="query" class="search" type="search" placeholder="Search titles and text" aria-label="Search posts" />
    <select v-model="author" aria-label="Filter by author">
      <option value="">All authors</option>
      <option v-for="u in users.state.list" :key="u.id" :value="u.id">{{ u.name }}</option>
    </select>
  </div>

  <LoadingState v-if="posts.state.loading" label="Fetching posts…" />
  <ErrorState v-else-if="posts.state.error" :message="posts.state.error" @retry="load(true)" />
  <template v-else>
    <p class="muted">{{ filtered.length }} {{ filtered.length === 1 ? 'post' : 'posts' }}</p>
    <p v-if="!filtered.length" class="empty">No posts match that search. Clear the filters or write the first one.</p>
    <ul v-else class="post-list">
      <PostRow v-for="p in shown" :key="p.id" :post="p" />
    </ul>
    <div v-if="filtered.length > visible" class="actions">
      <button class="btn btn--ghost" type="button" @click="visible += 15">Show more posts</button>
    </div>
  </template>
</template>
