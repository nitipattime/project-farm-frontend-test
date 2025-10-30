import { useAuthStore } from '@/stores/auth'
import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// guard
router.beforeEach((to) => {
  const auth = useAuthStore()

  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !auth.token) {
    return '/login'
  }
})

export default function (app: App) {
  app.use(router)
}

export { router }
