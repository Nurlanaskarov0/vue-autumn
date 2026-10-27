<script setup>
import { useUsers } from '../stores/users'

defineProps({ post: { type: Object, required: true } })
const users = useUsers()
</script>

<template>
  <li class="post-row">
    <RouterLink :to="{ name: 'post-detail', params: { id: post.id } }" class="post-row__link">
      <h3>{{ post.title }}</h3>
      <p class="post-row__excerpt">{{ post.body }}</p>
    </RouterLink>
    <p class="post-row__meta">
      <RouterLink :to="{ name: 'user-detail', params: { id: post.userId } }">
        {{ users.nameOf(post.userId) }}
      </RouterLink>
      <span v-if="post.local" class="tag">new this session</span>
    </p>
  </li>
</template>
