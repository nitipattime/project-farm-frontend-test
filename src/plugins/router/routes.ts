export const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboardV2',
        name: 'dashboardV2',
        component: () => import('@/pages/dashboardV2.vue'),
      },
      {
        path: '/farmDetail/:id',
        name: 'farm-detail',
        component: () => import('@/pages/farm-detail.vue'),
        props: true,
      },
      {
        path: '/houseDetail/:id',
        name: 'house-detail',
        component: () => import('@/pages/house-detail.vue'),
        props: true,
      },
      {
        path: '/addHouseDetail/:id',
        name: 'add-house-detail',

        component: () => import('@/pages/add-house-detail.vue'),

        // component: () => import('@/views/pages/form-layouts/FormAddHouseDetail.vue'),
        props: true,
      },
      {
        path: '/admin',
        name: 'main-admin',
        component: () => import('@/pages/main-admin.vue'),
        props: true,
      },
      {
        path: '/user-manage',
        name: 'user-manage',
        component: () => import('@/pages/admin/user-manage.vue'),
      },
      {
        path: '/import-file',
        name: 'import-file',
        component: () => import('@/pages/admin/import-excel.vue'),
      },
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
