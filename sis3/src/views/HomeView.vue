<script setup>
import { computed, onMounted } from 'vue'
import { usePosts } from '../stores/posts'
import { useUsers } from '../stores/users'
import { useAuth } from '../stores/auth'
import PostRow from '../components/PostRow.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const posts = usePosts()
const users = useUsers()
const { isLoggedIn, state: auth } = useAuth()

const latest = computed(() => posts.state.list.slice(0, 5))
const loading = computed(() => posts.state.loading || users.state.loading)
const error = computed(() => posts.state.error || users.state.error)

function load(force = false) {
  posts.load(force)
  users.load(force)
}
onMounted(() => load())
</script>

<template>
  <section class="hero">
    <h1>
      {{ isLoggedIn ? `Welcome back, ${auth.user.firstName}.` : 'See what the quay is talking about.' }}
    </h1>
    <p>Read notices from {{ users.state.list.length || 10 }} neighbours, add your own, and keep a list of jobs for the week.</p>
    <div class="actions">
      <RouterLink class="btn" to="/posts">Browse all posts</RouterLink>
      <RouterLink class="btn btn--ghost" :to="{ name: 'post-new' }">Write a post</RouterLink>
    </div>
  </section>

  <h2>Latest on the board</h2>
  <LoadingState v-if="loading && !latest.length" label="Fetching the latest posts…" />
  <ErrorState v-else-if="error" :message="error" @retry="load(true)" />
  <ul v-else class="post-list">
    <PostRow v-for="p in latest" :key="p.id" :post="p" />
  </ul>
</template>
