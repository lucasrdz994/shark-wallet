import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'

import { Locale } from 'vant'
import esES from 'vant/es/locale/lang/es-ES'

Locale.use('es-ES', esES)

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
