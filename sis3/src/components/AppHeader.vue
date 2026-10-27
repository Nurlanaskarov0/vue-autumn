<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { useToast } from '../stores/toast'

const router = useRouter()
const { state, isLoggedIn, fullName, logout } = useAuth()
const toast = useToast()

function signOut() {
  logout()
  toast.push('You are signed out.', 'info')
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="brand" aria-label="Harbor Board home">
      <span class="brand__mark" aria-hidden="true">⚓</span>
      <span class="brand__name">Harbor Board</span>
    </RouterLink>
    <p class="header__tagline">A noticeboard for the people on the quay</p>

    <div class="header__user">
      <template v-if="isLoggedIn">
        <img v-if="state.user.image" class="avatar" :src="state.user.image" alt="" />
        <span class="header__name">{{ fullName }}</span>
        <button class="btn btn--ghost" type="button" @click="signOut">Sign out</button>
      </template>
      <RouterLink v-else class="btn" :to="{ name: 'login' }">Sign in</RouterLink>
    </div>
  </header>
</template>
