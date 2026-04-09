import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { public: true },
        beforeEnter: (_, __, next) => {
          const { profile, isAuthenticated } = storeToRefs(useAuthStore());
          if (profile.value?.id) {
            next('/patient-dashboard');
            return;
          } else if (isAuthenticated.value) {
            next('/oauth-success?type=patient');
            return;
          } else {
            next();
          }
        }
      },
      {
        path: 'oauth-success',
        component: () => import('pages/OAuthSuccess.vue'),
      },
      {
        path: 'patient-register',
        component: () => import('pages/PatientRegister.vue'),
        beforeEnter: (_, __, next) => {
          const { profile } = storeToRefs(useAuthStore());
          if (profile.value?.id) {
            next('/patient-dashboard');
          } else {
            next();
          }
        }
      },
      {
        path: 'patient-dashboard',
        component: () => import('pages/PatientDashboard.vue'),
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { public: true }
  },
];

export default routes;
