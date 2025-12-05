import axios from '@/plugins/axios'

const API_URL = import.meta.env.VITE_API_URL

export const getExport = async (data?: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/report`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob',
    })

    if (response.status === 200 || response.status === 201) return response
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

export const getExportRaw = async (data?: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/report-raw`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob',
    })

    if (response.status === 200 || response.status === 201) return response
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
