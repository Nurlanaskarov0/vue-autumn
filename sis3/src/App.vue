<script setup>
import { useRouter } from 'vue-router'
import { navState } from './router'
import AppHeader from './components/AppHeader.vue'
import AppNav from './components/AppNav.vue'
import ToastHost from './components/ToastHost.vue'
import ErrorState from './components/ErrorState.vue'

const router = useRouter()
function retryNavigation() {
  navState.error = null
  router.go(0)
}
</script>

<template>
  <div class="shell">
    <div class="progress" :class="{ 'progress--on': navState.loading }" aria-hidden="true"></div>
    <AppHeader />
    <AppNav />
    <main class="main" id="main">
      <ErrorState
        v-if="navState.error"
        title="Page failed to load"
        :message="navState.error"
        @retry="retryNavigation"
      />
      <RouterView v-else />
    </main>
    <ToastHost />
  </div>
</template>
