<script setup>
import { useAuth } from '../stores/auth'
const { isLoggedIn } = useAuth()
</script>

<template>
  <nav class="nav" aria-label="Main">
    <RouterLink to="/" class="nav__link">Home</RouterLink>
    <RouterLink to="/posts" class="nav__link">Posts</RouterLink>
    <RouterLink to="/users" class="nav__link">People</RouterLink>
    <RouterLink to="/todos" class="nav__link">
      My tasks
      <span v-if="!isLoggedIn" class="nav__lock" title="Sign in required">sign in</span>
    </RouterLink>
  </nav>
</template>
