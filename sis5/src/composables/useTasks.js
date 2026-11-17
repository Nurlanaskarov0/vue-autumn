import { computed } from 'vue'
import { useTaskStore } from '../stores/tasks'
export const statusLabels = {todo:'To do',progress:'In progress',done:'Completed'}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}
export function useTasks() {
  const store=useTaskStore()
  const today=localDate()
  const overdue=task=>!!task.dueDate && task.dueDate<today && task.status!=='done'
  const filtered=computed(()=> {
    const query=store.search.trim().toLowerCase()
    const result=store.tasks.filter(t=>(!query || `${t.title} ${t.description}`.toLowerCase().includes(query)) && (store.statusFilter==='all'||t.status===store.statusFilter) && (store.priorityFilter==='all'||t.priority===store.priorityFilter) && (store.projectFilter==='all'||t.project===store.projectFilter))
    const rank={high:0,medium:1,low:2}
    return result.sort((a,b)=>store.sortBy==='priority' ? rank[a.priority]-rank[b.priority] : store.sortBy==='due' ? (a.dueDate||'9999').localeCompare(b.dueDate||'9999') : b.createdAt.localeCompare(a.createdAt))
  })
  const dueToday=computed(()=>store.tasks.filter(t=>t.dueDate===today && t.status!=='done').length)
  const overdueCount=computed(()=>store.tasks.filter(overdue).length)
  function formatDate(value) { return value ? new Intl.DateTimeFormat('en',{month:'short',day:'numeric'}).format(new Date(`${value}T12:00:00`)) : 'No due date' }
  return {store,filtered,dueToday,overdueCount,overdue,formatDate}
}
