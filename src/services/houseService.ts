// src/services/farmService.ts
import axios from '@/plugins/axios'

const API_URL = import.meta.env.VITE_API_URL

export const getHouse = async (data?: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses`, {
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

export const createHouse = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${API_URL}/houses`, data || {}, {
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

export const createHouseDetail = async (data: any, houseID: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.post(`${API_URL}/houses/${houseID}/details`, data || {}, {
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

export const getHouseSummary = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/summary`, {
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

export const getHouseCVHistory = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/cv-history`, {
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

export const getHouseWeekly = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/weekly`, {
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

export const getHouseWeightChart = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/weight-chart`, {
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

export const getMachineAvailable = async () => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/machines/available`, {
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

export const getMachineSilos = async () => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const response = await axios.get(`${API_URL}/machines/silos`, {
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

export const markHouseFinish = async (data: any) => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    console.log(data)

    const response = await axios.put(
      `${API_URL}/houses/${data}/finish`,
      {},
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
