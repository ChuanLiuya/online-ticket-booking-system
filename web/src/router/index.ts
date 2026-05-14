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
          path: '/all-events',
          name: 'all-events',
          component: () => import('../view/layout/AllEventsView.vue'),
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
              path: '/profile/my-tickets',
              name: 'my-tickets',
              component: () => import('../view/layout/profile/MyTicketsView.vue'),
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
        {
          path: '/create-event',
          name: 'create-event',
          component: () => import('../view/layout/CreateEventView.vue'),
        },
        {
          path: '/edit-event/:id',
          name: 'edit-event',
          component: () => import('../view/layout/EditEventView.vue'),
        },
        {
          path: '/events/:id',
          name: 'event-detail',
          component: () => import('../view/layout/EventDetailView.vue'),
        },
        {
          path: '/payment/:orderId',
          name: 'payment',
          component: () => import('../view/layout/PaymentView.vue'),
        },
        {
          path: '/users/:id',
          name: 'users',
          redirect: (to) => ({
            name: 'user-events',
            params: { id: to.params.id },
          }),
          component: () => import('../view/layout/UserDetailView.vue'),
          children: [
            {
              path: '/users/:id/events',
              name: 'user-events',
              component: () => import('../view/layout/user-detail/UserEventsView.vue'),
            },
            {
              path: '/users/:id/comments-from-others',
              name: 'user-comments-from-others',
              component: () => import('../view/layout/user-detail/UserCommentsFromOthersView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
