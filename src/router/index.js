import { createRouter, createWebHistory } from 'vue-router'

import Presentateur from '@/views/Presentateur.vue'
import Public from '@/views/Public.vue'
import Form from '@/views/Form.vue'
import Guest from '@/views/Guest.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/presenter',
      component: Presentateur,
      name : 'presentateur',
    },
    {
      path: '/',
      component: Public,
      name : 'public',
    },
    {
      path: '/form',
      component: Form,
      name : 'form',
    },
    {
      path: '/guest',
      component: Guest,
      name : 'guest',
    },
  ]
})

export default router
