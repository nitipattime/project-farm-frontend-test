export interface Farm {
  id: number
  farm_name: string
  house_count: number
  province: string
  district: string
  subdistrict: string
  contact_name: string
}

export interface FarmV2 {
  id: number
  farm_name: string
  house_count: number
  province: string
  district: string
  subdistrict: string
  contact_name: string
}

export interface FarmSummary {
  totalFarms: number
  totalHouses: number
  totalChicken: number
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Option {
  label: string
  value: string | number
}
