import axios from '@/plugins/axios'

const API_URL = import.meta.env.VITE_API_URL

export const getAllUsers = async () => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) return response.data
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

export const createUser = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${API_URL}/admin/users`, data || {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) return response.data
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

export const updateUserApi = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')

  try {
    const response = await axios.put(
      `${API_URL}/admin/users/${data.id}`,
      data.data || {}, // ← ส่งเป็น body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    if (response.status === 200 || response.status === 201) return response.data
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

export const deleteUser = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')

  try {
    const response = await axios.delete(`${API_URL}/admin/users/${data.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) return response.data
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
