import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useTaskStore, validateTask, STORAGE_KEY } from '../src/stores/tasks.js'
const sample={title:'  Learn Vue  ',description:'Practice composables',project:'Study',priority:'high',status:'todo',dueDate:'2026-11-20'}
function setup() {setActivePinia(createPinia());return useTaskStore()}
function memory(raw=null) {return {value:raw,getItem(key){assert.equal(key,STORAGE_KEY);return this.value},setItem(key,value){assert.equal(key,STORAGE_KEY);this.value=value}}}
test('task lifecycle preserves identity and supports status changes',()=>{
  const store=setup()
  store.addTask(sample)
  const {id,createdAt}=store.tasks[0]
  assert.equal(store.tasks[0].title,'Learn Vue')
  store.updateTask(id,{...sample,title:'Revised task'})
  assert.equal(store.tasks[0].id,id)
  assert.equal(store.tasks[0].createdAt,createdAt)
  store.setStatus(id,'done')
  assert.equal(store.completed,1)
  assert.equal(store.progress,100)
  store.removeTask(id)
  assert.equal(store.tasks.length,0)
  assert.equal(store.progress,0)
})
test('invalid values cannot enter store',()=>{
  const store=setup()
  for (const change of [{title:'  '},{status:'unknown'},{priority:'urgent'},{project:'Other'},{dueDate:'2026-02-30'},{title:'x'.repeat(121)}]) assert.throws(()=>store.addTask({...sample,...change}))
  assert.equal(store.tasks.length,0)
  assert.equal(validateTask({...sample,dueDate:''}).dueDate,'')
})
test('tasks round-trip through storage; intentionally empty data stays empty',()=>{
  let store=setup(),storage=memory()
  store.addTask(sample)
  store.persist(storage)
  const original=JSON.parse(JSON.stringify(store.tasks))
  store=setup();store.initialize(storage)
  assert.deepEqual(JSON.parse(JSON.stringify(store.tasks)),original)
  store.removeTask(store.tasks[0].id);store.persist(storage)
  store=setup();store.initialize(storage)
  assert.equal(store.tasks.length,0)
})
test('corrupt saved data is preserved and reports an error',()=>{
  const store=setup(),storage=memory('{broken')
  store.initialize(storage)
  assert.equal(store.tasks.length,0)
  assert.match(store.storageError,/could not be loaded/)
  assert.equal(storage.value,'{broken')
})
test('unavailable storage does not prevent task editing',()=>{
  const store=setup(),storage={getItem(){throw Error('denied')},setItem(){throw Error('full')}}
  store.initialize(storage)
  store.addTask(sample)
  store.persist(storage)
  assert.equal(store.tasks.length,1)
  assert.match(store.storageError,/could not be saved/)
})
test('seed data is persisted once; malformed records are rejected',()=>{
  let store=setup(),storage=memory()
  store.initialize(storage)
  assert.equal(store.tasks.length,6)
  assert.equal(JSON.parse(storage.value).length,6)
  store=setup();store.initialize(memory(JSON.stringify([{...sample,id:'1',createdAt:'invalid'}])))
  assert.equal(store.tasks.length,0)
  assert.ok(store.storageError)
})
