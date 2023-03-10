import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/reset.less'
import App from './App.vue'
import router from './router/index'
import pinia from './store/index'
import registerIcons from './global/register-icons'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(registerIcons)
app.mount('#app')
