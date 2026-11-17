import { reactive, ref } from 'vue'
import { useTaskStore } from '../stores/tasks'
const blank=()=>({title:'',description:'',project:'Study',status:'todo',priority:'medium',dueDate:''})
export function useTaskForm() {
  const store=useTaskStore(), open=ref(false), editingId=ref(null), error=ref(''), form=reactive(blank())
  function show(task=null) {editingId.value=task?.id || null;Object.assign(form,blank(),task || {});error.value='';open.value=true}
  function save() {
    try {
      if (editingId.value) store.updateTask(editingId.value,form)
      else store.addTask(form)
      open.value=false
      return true
    } catch(e) {error.value=e.message;return false}
  }
  return {open,editingId,error,form,show,save}
}
