import { createApp } from 'vue'
// import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// To Be Removed //////////////////////
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// ///////////////////////////////////

import App from '@/renderer/App.vue'
import pinia from '@/renderer/store'
import router from '@/renderer/router'
import vuetify from '@/renderer/plugins/vuetify'
import Avatar from 'vue3-avatar'
import '@/renderer/router/modules/help.permission'

// Add API key defined in contextBridge to window object type
declare global {
  interface Window {
    mainApi?: any
  }
}

// const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)

const app = createApp(App).component('avatar', Avatar)

app.use(pinia).use(vuetify)
app.use(router)

// TBR
app.use(ElementPlus)

app.mount('#app')
