import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Quickstart from '@/views/Quickstart.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        component: Quickstart
      },
      {
        path: 'howto',
        component: () => import('../views/HowTo.vue')
      },
      {
        path: 'about',
        component: () => import('../views/About.vue')
      },
      {
        path: 'settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  },
  {
    path: '/room/:gameid',
    name: 'Room',
    component: () => import('../views/Room.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
