<script setup>
defineProps({
  message: { type: String, required: true },
  title: { type: String, default: 'Something went wrong' },
})
defineEmits(['retry'])
</script>

<template>
  <div class="state state--error" role="alert">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button class="btn" type="button" @click="$emit('retry')">Try again</button>
  </div>
</template>
