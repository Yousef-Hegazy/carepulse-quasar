import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { public: true }
      },
      {
        path: 'oauth-success',
        component: () => import('pages/OAuthSuccess.vue'),
      },
      {
        path: 'patient-register',
        component: () => import('pages/PatientRegister.vue'),
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
