// src/plugins/axios.ts
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const instance = axios.create({
  baseURL: API_URL,
})

// ก่อนส่ง request → แนบ access token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token)
    config.headers.Authorization = `Bearer ${token}`

  return config
})

// ถ้าเจอ response 401 → ลอง refresh token อัตโนมัติ
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // ถ้าเจอ Unauthorized และยังไม่เคย retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          // ขอ accessToken ใหม่
          const res = await axios.post(`${API_URL}/refresh`, {
            refreshToken,
          })

          const newAccessToken = res.data.data.accessToken

          localStorage.setItem('accessToken', newAccessToken)

          // ใส่ token ใหม่ใน header แล้ว retry request เดิม
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return instance(originalRequest)
        }
        catch (refreshError) {
          console.error('❌ Refresh token invalid', refreshError)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

export default instance
