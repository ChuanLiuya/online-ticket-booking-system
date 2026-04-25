import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../view/index/IndexView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView,
    },
    {
      path: '/layout',
      component:import('../view/layout/LayoutView.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../view/layout/HomeView.vue'),
        },
        {
          path: '/movies',
          name: 'movies',
          component: () => import('../view/layout/MoviesView.vue'),
        }
      ],
    }
  ],
})

export default router
