// src/services/farmService.ts
import axios from 'axios'
const API_URL = 'https://jrlheater.com/api'
const API_KEY = 'a3f8c2d7e9b1f045b2a3c6d7e8f9a0b1'

export const getHouse = async (data?: any) => {
  try {
    const response = await axios.get(`${API_URL}/houses`, {
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

export const createHouse = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/houses`, data || {}, {
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

export const createHouseDetail = async (data: any, houseID: any) => {
  try {
    const response = await axios.post(`${API_URL}/houses/${houseID}/details`, data || {}, {
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

export const getHouseSummary = async (data: any) => {
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/summary`, {
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

export const getHouseCVHistory = async (data: any) => {
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/cv-history`, {
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

export const getHouseWeekly = async (data: any) => {
  try {
    const response = await axios.get(`${API_URL}/houses/${data.houseID}/weekly`, {
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

export const getMachineAvailable = async () => {
  try {
    const response = await axios.get(`${API_URL}/machines/available`, {
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

export const getMachineSilos = async () => {
  try {
    const response = await axios.get(`${API_URL}/machines/silos`, {
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

export const markHouseFinish = async (data: any) => {
  try {
    console.log(data)
    const response = await axios.put(
      `${API_URL}/houses/${data}/finish`,
      {},
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    )

    if (response.status === 200 || response.status === 201) {
      return response.data
    } else {
      return null
    }
  } catch (error: any) {
    throw error
  }
}
