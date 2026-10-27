<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '../stores/posts'
import { useAuth } from '../stores/auth'
import { useToast } from '../stores/toast'
import { errorMessage } from '../api/http'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'

// Used for both /posts/new (no id) and /posts/:id/edit
const props = defineProps({ id: { type: String, default: null } })

const router = useRouter()
const posts = usePosts()
const { boardUserId } = useAuth()
const toast = useToast()

const isEdit = computed(() => !!props.id)
const form = reactive({ title: '', body: '' })
const touched = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref(null)
let userId = null

const errors = computed(() => ({
  title: form.title.trim().length < 3 ? 'Give the post a title of at least 3 characters.' : '',
  body: form.body.trim().length < 10 ? 'Write at least 10 characters of text.' : '',
}))
const valid = computed(() => !errors.value.title && !errors.value.body)

async function load() {
  if (!isEdit.value) return
  loading.value = true
  error.value = null
  try {
    const post = await posts.getOne(props.id)
    form.title = post.title
    form.body = post.body
    userId = post.userId
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}

async function submit() {
  touched.value = true
  if (!valid.value) return
  saving.value = true
  try {
    const payload = { title: form.title.trim(), body: form.body.trim() }
    const saved = isEdit.value
      ? await posts.update(props.id, payload)
      : await posts.create({ ...payload, userId: boardUserId.value })
    toast.push(isEdit.value ? 'Post saved.' : 'Post published.', 'success')
    router.push({ name: 'post-detail', params: { id: saved.id } })
  } catch (e) {
    toast.push(errorMessage(e), 'error')
  } finally {
    saving.value = false
  }
}

watch(() => props.id, load, { immediate: true })
</script>

<template>
  <RouterLink class="back" :to="isEdit ? { name: 'post-detail', params: { id } } : '/posts'">Cancel</RouterLink>
  <h1>{{ isEdit ? 'Edit post' : 'Write a post' }}</h1>

  <LoadingState v-if="loading" label="Loading post…" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <form v-else class="card" style="max-width: 40rem" novalidate @submit.prevent="submit">
    <div class="field" :class="{ 'field--invalid': touched && errors.title }">
      <label for="title">Title</label>
      <input id="title" v-model="form.title" type="text" autocomplete="off" />
      <p v-if="touched && errors.title" class="field__error">{{ errors.title }}</p>
    </div>
    <div class="field" :class="{ 'field--invalid': touched && errors.body }">
      <label for="body">Text</label>
      <textarea id="body" v-model="form.body"></textarea>
      <p v-if="touched && errors.body" class="field__error">{{ errors.body }}</p>
    </div>
    <button class="btn" type="submit" :disabled="saving">
      {{ saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post' }}
    </button>
  </form>
</template>
