<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { useToast } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const { state, login } = useAuth()
const toast = useToast()

const username = ref('emilys')
const password = ref('emilyspass')

async function submit() {
  if (await login(username.value.trim(), password.value)) {
    toast.push('Signed in. Welcome aboard.', 'success')
    // Go back to the page that required sign-in (set by the router guard)
    const target = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
      ? route.query.redirect
      : '/'
    router.replace(target)
  }
}
</script>

<template>
  <h1>Sign in</h1>
  <p v-if="route.query.redirect" class="muted">Sign in to open that page.</p>

  <form class="card" novalidate @submit.prevent="submit">
    <p class="notice">
      Demo account from the DummyJSON test service: <code>emilys</code> / <code>emilyspass</code>
    </p>
    <p v-if="state.error" class="alert" role="alert">{{ state.error }}</p>
    <div class="field">
      <label for="username">Username</label>
      <input id="username" v-model="username" type="text" autocomplete="username" required />
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" autocomplete="current-password" required />
    </div>
    <button class="btn" type="submit" :disabled="state.loading || !username || !password">
      {{ state.loading ? 'Signing in…' : 'Sign in' }}
    </button>
  </form>
</template>
