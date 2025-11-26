import axios from '@/plugins/axios'

const API_URL = import.meta.env.VITE_API_URL

export const importFile = async (formData: FormData) => {
  const accessToken = localStorage.getItem('accessToken')

  try {
    const response = await axios.post(`${API_URL}/import-weight`, formData, {
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
