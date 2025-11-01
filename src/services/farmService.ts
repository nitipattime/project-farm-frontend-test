// src/services/farmService.ts
import axios from 'axios'

const API_URL = 'https://jrlheater.com/api'
const API_KEY = 'a3f8c2d7e9b1f045b2a3c6d7e8f9a0b1'

export const getFarms = async (data?: any) => {
  try {
    const response = await axios.get(`${API_URL}/farms`, {
      params: data || {},
      headers: {
        'x-api-key': API_KEY,
      },
    })

    if (response.status === 200 || response.status === 201) {
      return response.data
    } else {
      return null
    }
  } catch (error: any) {
    throw error
  }
}

export const createFarm = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/farms`, data || {}, {
      headers: {
        'x-api-key': API_KEY,
      },
    })
    if (response.status === 200 || response.status === 201) {
      return response.data
    } else {
      return null
    }
  } catch (error: any) {
    throw error
  }
}

// get province
export const getProvince = async () => {
  try {
    const response = await axios.get(`${API_URL}/provinces`, {
      headers: {
        'x-api-key': API_KEY,
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
    throw error
  }
}

// get districts
export const getDistricts = async (data: any) => {
  try {
    const response = await axios.get(`${API_URL}/provinces/${data.provinceId}/districts`, {
      headers: {
        'x-api-key': API_KEY,
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
    throw error
  }
}
// get subdistricts
export const getSubDistricts = async (data: any) => {
  try {
    const response = await axios.get(`${API_URL}/districts/${data.districtId}/subdistricts`, {
      params: data || {},
      headers: {
        'x-api-key': API_KEY,
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
    throw error
  }
}
// get Address
export const getAddress = async (data: any) => {
  try {
    const response = await axios.get(`${API_URL}/addresses`, {
      params: data || {},
      headers: {
        'x-api-key': API_KEY,
      },
    })

    if (response.status === 200 || response.status === 201) {
      return response.data.data
    } else {
      return null
    }
  } catch (error: any) {
    throw error
  }
}
