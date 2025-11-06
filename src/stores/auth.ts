import { defineStore } from 'pinia'

import { loginApi, logoutApi } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || '', // ดึง token จาก localStorage
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,

    // user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('accessToken', token)
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('accessToken')
    },
    async login(payload: { email: string; password: string }) {
      try {
        const res = await loginApi(payload)
        const data = res.data.data

        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken

        // this.user = data.user
        console.log('accessToken:')
        console.log(data.accessToken)
        console.log('refreshToken:')
        console.log(data.refreshToken)

        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.user))

        return true
      } catch (err: any) {
        // this.error = err.response?.data?.message || err.message
        console.error('Login failed:', err.response?.data || err.message)

        return false
      }
    },

    async logout() {
      try {
        // เรียก API logout ถ้ามี
        if (this.refreshToken) await logoutApi(this.accessToken)
      } catch (err: any) {
        console.warn('Logout API error:', err.response?.data || err.message)
      } finally {
        this.accessToken = null
        this.refreshToken = null

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },
  },
})

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     token: localStorage.getItem('token') || null,
//     user: null,
//   }),
//   actions: {
//     async login(username: string, password: string) {
//       // mock API
//       if (username === 'admin' && password === '1234') {
//         const token = 'fake-jwt-token'

//         this.token = token
//         localStorage.setItem('token', token)

//         return true
//       }

//       return false
//     },
//     logout() {
//       this.token = null
//       localStorage.removeItem('token')
//     },
//   },
// })
