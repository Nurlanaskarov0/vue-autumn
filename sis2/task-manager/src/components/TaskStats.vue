<script>
export default {
  name: 'TaskStats',
  // данные приходят от родителя через props
  props: {
    total: { type: Number, required: true },
    active: { type: Number, required: true },
    completed: { type: Number, required: true }
  }
}
</script>

<template>
  <BaseCard>
    <template #header>Statistics</template>
    <p>Total tasks: {{ total }}</p>
    <p>Active: {{ active }}</p>
    <p>Completed: {{ completed }}</p>
  </BaseCard>
</template>
