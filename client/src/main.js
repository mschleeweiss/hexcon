import { createApp } from 'vue'
import App from '@/App.vue'

import VueSocketIOExt from 'vue-socket.io-extended'
import router from '@/router'
import store from '@/store'
import socket from '@/socket'

const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(VueSocketIOExt, socket)
  .mount('#app')
