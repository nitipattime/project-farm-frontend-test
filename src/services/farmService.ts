// src/services/farmService.ts
import axios from '@/plugins/axios'

const API_URL = import.meta.env.VITE_API_URL

export const getFarms = async (data?: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/farms`, {
      params: data || {},
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

export const createFarm = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${API_URL}/farms`, data || {}, {
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

// get province
export const getProvince = async () => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/provinces`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) {
      return response.data.data.map((item: any) => ({
        label: item.name_th,
        value: item.id,
      }))
    } else {
      return null
    }
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

// get districts
export const getDistricts = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/provinces/${data.provinceId}/districts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) {
      return response.data.data.map((item: any) => ({
        label: item.name_th,
        value: item.id,
      }))
    } else {
      return null
    }
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

// get subdistricts
export const getSubDistricts = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/districts/${data.districtId}/subdistricts`, {
      params: data || {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) {
      return response.data.data.map((item: any) => ({
        label: item.name_th,
        value: item.id,
        zip_code: item.zip_code,
      }))
    } else {
      return null
    }
  } catch (error: any) {
    console.log(error)
    throw error
  }
}

// get Address
export const getAddress = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/addresses`, {
      params: data || {},
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200 || response.status === 201) return response.data.data
    else return null
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
