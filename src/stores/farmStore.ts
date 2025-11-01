// src/store/farmStore.ts
import { createFarm, getAddress, getDistricts, getFarms, getProvince, getSubDistricts } from '@/services/farmService'
import type { Farm, Option } from '@/types/farm'
import { defineStore } from 'pinia'

export const useFarmStore = defineStore('farm', {
  state: () => ({
    farmlist: [] as Farm[],
    // farmlistV2: [] as FarmV2[],
    summary: {
      totalFarms: 0,
      totalHouses: 0,
      totalChicken: 0,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    provinces: [] as Array<Option>,
    districts: [] as Array<Option>,
    subdistricts: [] as Array<Option>,
    address: [] as Array<Option>,
    selectedProvince: null as number | null,
    selectedDistrict: null as number | null,
    selectedSubdistrict: null as number | null,

    loading: false,
    error: null as string | null,
    count: 0,
  }),

  actions: {
    async fetchFarms(payload: any) {
      this.loading = true
      try {
        const res = await getFarms(payload)
        this.farmlist = res.data.list
        this.pagination = {
          page: res.data.page,
          limit: res.data.limit,
          total: res.data.total,
          totalPages: res.data.totalPages,
        }
        this.summary = res.data.summary
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addFarm(farmData: any) {
      try {
        const res = await createFarm(farmData)
        this.farmlist.push(res.data)
      } catch (err: any) {
        this.error = err.message
      }
    },

    async fetchDistrict(data: any) {
      this.loading = true
      try {
        const res = await getDistricts(data)
        this.districts = res
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async fetchSubDistrict(data: any) {
      this.loading = true
      try {
        const res = await getSubDistricts(data)
        this.subdistricts = res
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async fetchProvince() {
      this.loading = true
      try {
        const res = await getProvince()
        this.provinces = res
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchAddress(data: any) {
      this.loading = true
      try {
        const res = await getAddress(data)
        this.address = res
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // async editFarm(id: string, updatedData: any) {
    //     try {
    //         const res = await updateFarm(id, updatedData)
    //         const index = this.farmlist.findIndex(f => f.id === id)
    //         if (index !== -1) this.farmlist[index] = res.data
    //     } catch (err: any) {
    //         this.error = err.message
    //     }
    // },
    incrementCount() {
      this.count++
    },
    decrementCount() {
      this.count--
    },
  },
})
