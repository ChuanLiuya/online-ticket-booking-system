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
      component: () => import('../view/layout/LayoutView.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../view/layout/HomeView.vue'),
        },
        {
          path: '/events',
          name: 'events',
          component: () => import('../view/layout/EventsView.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          redirect: '/profile/my-events',
          component: () => import('../view/layout/ProfileView.vue'),
          children: [
            {
              path: '/profile/my-events',
              name: 'my-events',
              component: () => import('../view/layout/profile/MyEventsView.vue'),
            },
            {
              path: '/profile/joined-events',
              name: 'joined-events',
              component: () => import('../view/layout/profile/JoinedEventsView.vue'),
            },
            {
              path: '/profile/orders',
              name: 'orders',
              component: () => import('../view/layout/profile/OrdersView.vue'),
            },
            {
              path: '/profile/settings',
              name: 'settings',
              component: () => import('../view/layout/profile/SettingsView.vue'),
            },
          ],
                 },
      ],
    },
  ],
})

export default router
