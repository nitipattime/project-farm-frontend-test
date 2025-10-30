import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  actions: {
    async login(username: string, password: string) {
      // mock API
      if (username === 'admin' && password === '1234') {
        const token = 'fake-jwt-token'
        this.token = token
        localStorage.setItem('token', token)
        return true
      }
      return false
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
