<script setup>
import { computed } from 'vue'
import { api } from '../services/api'
import { useRequest } from '../composables/useRequest'
import { useTaskStatus } from '../composables/useTaskStatus'
import { subjects } from '../catalog'
import { ArrowRightOutlined, ReloadOutlined } from '@ant-design/icons-vue'
const { data, loading, error, reload } = useRequest(async signal => {
  const [todos, posts] = await Promise.all([api.get('/todos', { params:{userId:1}, signal }), api.get('/posts', { params:{_limit:3}, signal })])
  return { todos: todos.data, posts: posts.data }
})
const { completed } = useTaskStatus()
const done = computed(() => data.value?.todos.filter(completed).length || 0)
const progress = computed(() => data.value ? Math.round(done.value / data.value.todos.length * 100) : 0)
</script>
<template>
  <div class="page-heading"><div><div class="eyebrow">MAKE ROOM FOR GROWTH</div><h1>Your learning, at a glance.</h1><p>Welcome back, Nurlan. Let's make today a good one.</p></div><a-button @click="reload" :loading="loading"><ReloadOutlined /> Refresh</a-button></div>
  <section class="hero"><div><div class="eyebrow">A NEW DAY. A NEW POSSIBILITY.</div><h2>Small steps.<br>Big possibilities.</h2><p>Keep your curiosity going. Your next breakthrough<br class="desktop-only"> could be one lesson away.</p><router-link to="/courses"><a-button size="large">Continue learning <ArrowRightOutlined /></a-button></router-link></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="art-card card-one">✦<span>STAY CURIOUS</span></div><div class="art-card card-two">↗</div><div class="art-star">✳</div></div></section>
  <a-alert v-if="error" type="error" show-icon :message="error" style="margin-bottom:20px"><template #action><a-button size="small" @click="reload">Try again</a-button></template></a-alert>
  <a-skeleton v-if="loading" active :paragraph="{rows:3}" />
  <template v-else-if="data">
    <div class="stats-grid"><div class="stat"><span>Enrolled courses</span><strong>04 <small>this semester</small></strong><div class="mini-line"></div></div><div class="stat"><span>Assignments completed</span><strong>{{done.toString().padStart(2,'0')}} <small>of {{data.todos.length}} tasks</small></strong><a-progress :percent="progress" :show-info="false" size="small" /></div><div class="stat"><span>Learning progress</span><strong>{{progress}}<em>%</em> <small>keep moving forward</small></strong><a-progress :percent="progress" :show-info="false" size="small" stroke-color="#c8a66b" /></div></div>
  </template>
  <div class="overview-grid"><section><div class="section-heading"><h2>Pick up where you left off</h2><router-link to="/courses">All courses ↗</router-link></div><div class="course-preview" v-for="(course,index) in subjects.slice(0,2)" :key="course.code"><div class="subject-icon" :style="{background:course.color}">{{course.icon}}</div><div class="preview-text"><small>{{course.code}} · {{course.category}}</small><h3>{{course.name}}</h3><p>{{course.instructor}}</p></div><router-link :to="'/courses?course='+index"><a-button shape="circle" aria-label="View course"><ArrowRightOutlined /></a-button></router-link></div></section><section class="focus-card"><span class="eyebrow">YOUR STUDY SPACE</span><h2>One thing at a time.</h2><p>Find your next task, clear your mind, and give it your full attention.</p><router-link to="/assignments">Open assignments <ArrowRightOutlined /></router-link><div class="focus-drawing" aria-hidden="true">◎</div></section></div>
  <section v-if="data && !loading"><div class="section-heading"><h2>Campus bulletin</h2><a-tag>Live REST API</a-tag></div><div class="bulletin-grid"><article class="bulletin" v-for="(post,i) in data.posts" :key="post.id"><span class="eyebrow">COMMUNITY / 0{{i+1}}</span><h3>{{post.title}}</h3><p>{{post.body}}</p></article></div><p class="data-note">Demo bulletin and assignment data provided by JSONPlaceholder. Course catalog is illustrative.</p></section>
</template>
