import { defineStore } from 'pinia'
export const STORAGE_KEY = 'sis5-taskly-v1'
export const statuses = ['todo', 'progress', 'done']
export const priorities = ['low', 'medium', 'high']
export const projects = ['Study', 'Personal', 'Work']
const dateOffset = days => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
export function validateTask(input) {
  if (!input || typeof input.title !== 'string' || !input.title.trim()) throw new Error('Please enter a task title.')
  if (input.title.trim().length > 120) throw new Error('Keep the title under 121 characters.')
  if (typeof input.description !== 'string' || input.description.length > 2000) throw new Error('Description must be at most 2,000 characters.')
  if (!statuses.includes(input.status) || !priorities.includes(input.priority) || !projects.includes(input.project)) throw new Error('Choose a valid status, priority, and project.')
  if (input.dueDate && (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate) || !Number.isFinite(Date.parse(input.dueDate)) || new Date(`${input.dueDate}T12:00:00Z`).toISOString().slice(0,10) !== input.dueDate)) throw new Error('Choose a valid due date.')
  return {title:input.title.trim(),description:input.description.trim(),status:input.status,priority:input.priority,project:input.project,dueDate:input.dueDate || ''}
}
function initialTasks() {
  return [
    {title:'Build something you’re proud of',description:'Create the SIS 5 task manager with Vue 3, Pinia, Ant Design Vue, and composables.',status:'progress',priority:'high',project:'Study',dueDate:dateOffset(1)},
    {title:'Review Vue composables',description:'Explore how reusable composition functions keep components focused.',status:'todo',priority:'medium',project:'Study',dueDate:dateOffset(0)},
    {title:'Plan the week ahead',description:'Choose three things that matter most this week.',status:'todo',priority:'low',project:'Personal',dueDate:dateOffset(2)},
    {title:'Prepare project presentation',description:'Walk through the store, actions, filters, and persistence.',status:'todo',priority:'high',project:'Work',dueDate:dateOffset(3)},
    {title:'Set up the workspace',description:'Install dependencies and create the Vue project.',status:'done',priority:'medium',project:'Study',dueDate:dateOffset(-1)},
    {title:'Read a chapter',description:'Make a little time for a good book.',status:'progress',priority:'low',project:'Personal',dueDate:''}
  ].map((task,index)=>({...task,id:`sample-${index+1}`,createdAt:new Date().toISOString()}))
}
export const useTaskStore = defineStore('tasks', {
  state: () => ({ tasks: [], search:'', statusFilter:'all', priorityFilter:'all', projectFilter:'all', sortBy:'newest', view:'board', storageError:'', initialized:false }),
  getters: {
    completed: state => state.tasks.filter(t=>t.status==='done').length,
    active: state => state.tasks.filter(t=>t.status!=='done').length,
    progress() { return this.tasks.length ? Math.round(this.completed / this.tasks.length * 100) : 0 }
  },
  actions: {
    initialize(storage) {
      if (this.initialized) return
      this.initialized = true
      try {
        const raw = storage.getItem(STORAGE_KEY)
        if (raw === null) { this.tasks = initialTasks(); this.persist(storage); return }
        const saved = JSON.parse(raw)
        if (!Array.isArray(saved) || new Set(saved.map(t=>t?.id)).size !== saved.length) throw new Error('Invalid data')
        this.tasks = saved.map(t=> {
          if (typeof t.id !== 'string' || !t.id || !Number.isFinite(Date.parse(t.createdAt))) throw new Error('Invalid task')
          return { ...validateTask(t), id:t.id, createdAt:t.createdAt }
        })
      } catch {
        this.tasks = []
        this.storageError = 'Saved tasks could not be loaded. Your existing saved data has not been changed. You can continue in this session.'
      }
    },
    persist(storage) {
      try { storage.setItem(STORAGE_KEY, JSON.stringify(this.tasks)); this.storageError='' }
      catch { this.storageError='Your changes are available in this session, but could not be saved on this device.' }
    },
    addTask(input) { this.tasks.unshift({...validateTask(input),id:crypto.randomUUID(),createdAt:new Date().toISOString()}) },
    updateTask(id,input) {
      const task=this.tasks.find(t=>t.id===id)
      if (!task) throw new Error('This task no longer exists.')
      Object.assign(task,validateTask(input))
    },
    setStatus(id,status) {
      if (!statuses.includes(status)) throw new Error('Invalid status.')
      const task=this.tasks.find(t=>t.id===id)
      if (task) task.status=status
    },
    removeTask(id) {this.tasks=this.tasks.filter(t=>t.id!==id)},
    clearFilters() {this.search='';this.statusFilter='all';this.priorityFilter='all';this.projectFilter='all'}
  }
})
