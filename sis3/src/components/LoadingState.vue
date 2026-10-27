<script setup>
defineProps({ label: { type: String, default: 'Loading…' } })
</script>

<template>
  <div class="state" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <p>{{ label }}</p>
  </div>
</template>
