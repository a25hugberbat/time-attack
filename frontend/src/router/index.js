import { createRouter, createWebHistory } from 'vue-router'
import GameBoardView from '../views/GameBoardView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameBoardView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    }
  ]
})

export default router