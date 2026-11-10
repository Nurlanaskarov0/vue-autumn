<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppstoreOutlined, BookOutlined, CheckSquareOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
const route = useRoute()
const selected = computed(() => [route.path])
</script>
<template>
  <a-config-provider :theme="{token:{colorPrimary:'#245d4e',borderRadius:10,fontFamily:'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'}}">
    <div class="app-shell">
      <aside class="sidebar">
        <router-link class="brand" to="/"><span class="brand-mark">c.</span> campus<span class="brand-dot">●</span></router-link>
        <div class="workspace-label">STUDENT WORKSPACE</div>
        <a-menu mode="inline" :selectedKeys="selected">
          <a-menu-item key="/"><router-link to="/"><AppstoreOutlined /> Overview</router-link></a-menu-item>
          <a-menu-item key="/courses"><router-link to="/courses"><BookOutlined /> My courses</router-link></a-menu-item>
          <a-menu-item key="/assignments"><router-link to="/assignments"><CheckSquareOutlined /> Assignments</router-link></a-menu-item>
          <a-menu-item key="/profile"><router-link to="/profile"><UserOutlined /> My profile</router-link></a-menu-item>
        </a-menu>
        <div class="sidebar-note"><span>YOUR NEXT CHAPTER</span><h3>A little progress,<br>every day.</h3><p>Your learning journey starts with showing up.</p><router-link to="/courses">Explore your courses <ArrowRightOutlined /></router-link></div>
        <router-link to="/profile" class="sidebar-profile"><a-avatar style="background:#e7cfae;color:#493c2c">NA</a-avatar><div><strong>Nurlan Askarov</strong><small>Student · Fall semester</small></div></router-link>
      </aside>
      <main class="main-shell">
        <header class="topbar"><div>Workspace <span>/</span> <strong>{{route.meta.title}}</strong></div><div class="term"><span class="status-dot"></span> Fall semester <a-avatar size="small" style="background:#245d4e">N</a-avatar></div></header>
        <div class="page"><router-view /></div>
        <footer>Campus / Student workspace <span>SIS 4 · Vue 3 + Ant Design Vue</span></footer>
      </main>
    </div>
  </a-config-provider>
</template>
