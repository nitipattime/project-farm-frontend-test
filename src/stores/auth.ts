import { defineStore } from 'pinia'

import { getMeInfoApi, loginApi, logoutApi, refreshTokenApi } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || '', // ดึง token จาก localStorage
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: (() => {
      const user = localStorage.getItem('user')
      try {
        return user ? JSON.parse(user) : null
      } catch {
        return null
      }
    })(),
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

        const resUserInfo = await getMeInfoApi()
        const userData = resUserInfo.data.data

        // เก็บข้อมูลผู้ใช้
        this.user = userData
        localStorage.setItem('user', JSON.stringify(userData))

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
        if (this.refreshToken) await logoutApi()
      } catch (err: any) {
        console.warn('Logout API error:', err.response?.data || err.message)
      } finally {
        this.accessToken = null
        this.refreshToken = null
        this.user = null

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },
    async refresh() {
      try {
        if (this.refreshToken) {
          const res = await refreshTokenApi()
          const data = res.data.data

          this.accessToken = data.accessToken
          this.refreshToken = data.refreshToken

          // this.user = data.user
          // console.log('accessToken:')
          // console.log(data.accessToken)
          // console.log('refreshToken:')
          // console.log(data.refreshToken)

          localStorage.setItem('accessToken', data.accessToken)
          localStorage.setItem('refreshToken', data.refreshToken)

          // localStorage.setItem('user', JSON.stringify(data.user))

          return true
        }
      } catch (err: any) {
        console.warn('Refresh API error:', err.response?.data || err.message)
      } finally {
        this.accessToken = null
        this.refreshToken = null
        this.user = null

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },
  },
})
