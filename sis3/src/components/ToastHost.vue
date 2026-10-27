<script setup>
import { useToast } from '../stores/toast'
const { state, dismiss } = useToast()
</script>

<template>
  <div class="toasts" aria-live="polite">
    <button
      v-for="t in state.items"
      :key="t.id"
      class="toast"
      :class="`toast--${t.type}`"
      type="button"
      @click="dismiss(t.id)"
    >
      {{ t.message }}
    </button>
  </div>
</template>
