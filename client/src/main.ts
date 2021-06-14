import { createApp } from 'vue';
import VueSocketIOExt from 'vue-socket.io-extended';

import App from './App.vue';
import router from '@/router';
import store from '@/store';
import socket from '@/socket';

createApp(App).use(store).use(router).use(VueSocketIOExt, socket).mount('#app');
