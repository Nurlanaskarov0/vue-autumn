import { reactive } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../stores/auth'

// Shared flag so App.vue can show a progress bar while a lazy route chunk downloads
export const navState = reactive({ loading: false, error: null })

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'), // lazy loaded
    meta: { title: 'Home' },
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../views/PostsView.vue'),
    meta: { title: 'Posts' },
  },
  {
    path: '/posts/new',
    name: 'post-new',
    component: () => import('../views/PostFormView.vue'),
    meta: { title: 'New post', requiresAuth: true },
  },
  {
    // Dynamic routing: :id is passed to the view as a prop (digits only)
    path: '/posts/:id(\\d+)',
    name: 'post-detail',
    component: () => import('../views/PostDetailView.vue'),
    props: true,
    meta: { title: 'Post' },
  },
  {
    path: '/posts/:id(\\d+)/edit',
    name: 'post-edit',
    component: () => import('../views/PostFormView.vue'),
    props: true,
    meta: { title: 'Edit post', requiresAuth: true },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue'),
    meta: { title: 'People' },
  },
  {
    path: '/users/:id(\\d+)',
    name: 'user-detail',
    component: () => import('../views/UserDetailView.vue'),
    props: true,
    meta: { title: 'Profile' },
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('../views/TodosView.vue'),
    meta: { title: 'My tasks', requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Sign in', guestOnly: true },
  },
  {
    // Catch-all: any unknown URL lands on the 404 page
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Authorization guard
router.beforeEach((to) => {
  const { isLoggedIn } = useAuth()
  navState.loading = true
  navState.error = null

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isLoggedIn.value) {
    return { name: 'home' }
  }
})

router.afterEach((to) => {
  navState.loading = false
  document.title = `${to.meta.title ?? 'Harbor Board'} · Harbor Board`
})

// A lazy route chunk failed to download (offline, new deploy, etc.)
router.onError((error) => {
  navState.loading = false
  navState.error = 'That page could not be loaded. Check your connection and try again.'
  console.error(error)
})

export default router
