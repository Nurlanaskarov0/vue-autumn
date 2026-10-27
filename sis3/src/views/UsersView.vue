<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUsers } from '../stores/users'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

const users = useUsers()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return users.state.list.filter(
    (u) => !q || u.name.toLowerCase().includes(q) || u.company.name.toLowerCase().includes(q),
  )
})

onMounted(() => users.load())
</script>

<template>
  <h1>People</h1>
  <div class="toolbar">
    <input v-model="query" class="search" type="search" placeholder="Search by name or company" aria-label="Search people" />
  </div>

  <LoadingState v-if="users.state.loading" label="Fetching people…" />
  <ErrorState v-else-if="users.state.error" :message="users.state.error" @retry="users.load(true)" />
  <template v-else>
    <p v-if="!filtered.length" class="empty">Nobody matches “{{ query }}”.</p>
    <ul v-else class="people">
      <li v-for="u in filtered" :key="u.id" class="person">
        <RouterLink :to="{ name: 'user-detail', params: { id: u.id } }">
          <h3>{{ u.name }}</h3>
          <p>{{ u.company.name }}</p>
          <p>{{ u.address.city }}</p>
        </RouterLink>
      </li>
    </ul>
  </template>
</template>
