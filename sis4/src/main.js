import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'
import Overview from './views/Overview.vue'
import Courses from './views/Courses.vue'
import Assignments from './views/Assignments.vue'
import Profile from './views/Profile.vue'
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/', component: Overview, meta: { title: 'Overview' } },
  { path: '/courses', component: Courses, meta: { title: 'My courses' } },
  { path: '/assignments', component: Assignments, meta: { title: 'Assignments' } },
  { path: '/profile', component: Profile, meta: { title: 'Student profile' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
] })
createApp(App).use(router).use(Antd).mount('#app')
