import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const loginApi = (payload: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, payload)
}

export const logoutApi = () => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  return axios.post(
    `${API_URL}/logout`,
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
}

// api.ts
// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'https://your-api.com',
// })

// // ====== Token Storage Helpers ======
// function getAccessToken() {
//   return localStorage.getItem('accessToken')
// }
// function getRefreshToken() {
//   return localStorage.getItem('refreshToken')
// }
// function setTokens(accessToken: string, refreshToken: string) {
//   localStorage.setItem('accessToken', accessToken)
//   localStorage.setItem('refreshToken', refreshToken)
// }
// function clearTokens() {
//   localStorage.removeItem('accessToken')
//   localStorage.removeItem('refreshToken')
// }

// // ====== Attach token before every request ======
// api.interceptors.request.use(config => {
//   const token = getAccessToken()
//   if (token) config.headers.Authorization = `Bearer ${token}`

//   return config
// })

// // ====== Handle token expiration ======
// let isRefreshing = false
// let subscribers: ((token: string) => void)[] = []

// function onRefreshed(token: string) {
//   subscribers.forEach(callback => callback(token))
//   subscribers = []
// }

// function addSubscriber(callback: (token: string) => void) {
//   subscribers.push(callback)
// }

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config

//     // ถ้าเจอ Unauthorized และยังไม่ได้พยายาม refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       if (!isRefreshing) {
//         isRefreshing = true
//         try {
//           const response = await axios.post('https://your-api.com/refresh', {
//             refreshToken: getRefreshToken(),
//           })

//           const { accessToken, refreshToken } = response.data.data

//           setTokens(accessToken, refreshToken)
//           api.defaults.headers.Authorization = `Bearer ${accessToken}`
//           onRefreshed(accessToken)
//         } catch (err) {
//           clearTokens()
//           window.location.href = '/login'

//           return Promise.reject(err)
//         } finally {
//           isRefreshing = false
//         }
//       }

//       return new Promise(resolve => {
//         addSubscriber((token: string) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`
//           resolve(api(originalRequest))
//         })
//       })
//     }

//     return Promise.reject(error)
//   },
// )

// export default api
