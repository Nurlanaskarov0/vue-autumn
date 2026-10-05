<script>
// Глобальный компонент со слотами: header и обычный (default)
export default { name: 'BaseCard' }
</script>

<template>
  <div>
    <h2><slot name="header" /></h2>
    <slot />
    <hr />
  </div>
</template>
