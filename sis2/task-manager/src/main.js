import { createApp } from 'vue'
import App from './App.vue'
import BaseCard from './components/BaseCard.vue'
import BaseButton from './components/BaseButton.vue'

const app = createApp(App)

// Global components: available in every template without importing
app.component('BaseCard', BaseCard)
app.component('BaseButton', BaseButton)

app.mount('#app')
