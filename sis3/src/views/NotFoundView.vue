<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const path = '/' + [].concat(route.params.pathMatch).join('/')
</script>

<template>
  <section class="lost">
    <p class="lost__code">4<span>0</span>4</p>
    <h1>This page has drifted off.</h1>
    <p>Nothing lives at <code>{{ path }}</code>. Check the address, or head back to the board.</p>
    <div class="actions">
      <RouterLink class="btn" to="/">Go home</RouterLink>
      <RouterLink class="btn btn--ghost" to="/posts">Browse posts</RouterLink>
    </div>
  </section>
</template>
