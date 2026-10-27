<script setup>
import { ref, watch } from 'vue'
import { jsonApi, errorMessage } from '../api/http'
import { usePosts } from '../stores/posts'
import PostRow from '../components/PostRow.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const props = defineProps({ id: { type: String, required: true } })
const postsStore = usePosts()

const user = ref(null)
const userPosts = ref([])
const loading = ref(false)
const error = ref(null)

async function load() {
  loading.value = true
  error.value = null
  user.value = null
  try {
    const [{ data }, list] = await Promise.all([
      jsonApi.get(`/users/${props.id}`),
      postsStore.getByUser(props.id),
    ])
    user.value = data
    userPosts.value = list
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(() => props.id, load, { immediate: true })
</script>

<template>
  <RouterLink class="back" to="/users">Back to people</RouterLink>

  <LoadingState v-if="loading" label="Loading profile…" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <template v-else-if="user">
    <h1>{{ user.name }}</h1>
    <p class="muted">@{{ user.username }}</p>
    <dl class="facts">
      <dt>Email</dt><dd><a :href="`mailto:${user.email}`">{{ user.email }}</a></dd>
      <dt>Phone</dt><dd>{{ user.phone }}</dd>
      <dt>Website</dt><dd>{{ user.website }}</dd>
      <dt>Company</dt><dd>{{ user.company.name }}</dd>
      <dt>Address</dt><dd>{{ user.address.street }}, {{ user.address.city }}</dd>
    </dl>

    <h2>Posts by {{ user.name.split(' ')[0] }} ({{ userPosts.length }})</h2>
    <p v-if="!userPosts.length" class="empty">This person has not posted yet.</p>
    <ul v-else class="post-list">
      <PostRow v-for="p in userPosts" :key="p.id" :post="p" />
    </ul>

    <div class="actions">
      <RouterLink v-if="+id > 1" class="btn btn--ghost" :to="{ name: 'user-detail', params: { id: +id - 1 } }">Previous person</RouterLink>
      <RouterLink v-if="+id < 10" class="btn btn--ghost" :to="{ name: 'user-detail', params: { id: +id + 1 } }">Next person</RouterLink>
    </div>
  </template>
</template>
