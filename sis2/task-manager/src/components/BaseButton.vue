<script>
// Глобальный компонент: обычная кнопка
export default {
  name: 'BaseButton',
  props: {
    type: { type: String, default: 'button' }
  }
}
</script>

<template>
  <button :type="type"><slot /></button>
</template>
