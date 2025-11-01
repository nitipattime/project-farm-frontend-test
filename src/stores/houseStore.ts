// src/store/farmStore.ts
import {
  createHouse,
  getHouse,
  getHouseCVHistory,
  getHouseSummary,
  getHouseWeekly,
  getMachineAvailable,
  getMachineSilos,
} from '@/services/houseService'
import type { HouseSummary } from '@/types/house'
import { defaultHouseSummary } from '@/types/house'
import { defineStore } from 'pinia'

export const useHouseStore = defineStore('house', {
  state: () => ({
    houselist: [] as any[],
    summary: {
      farmName: '',
      totalHouses: 0,
      totalChicken: 0,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    houseSummary: { ...defaultHouseSummary } as HouseSummary,
    houseWeekly: [] as any[],
    houseCVHistory: [] as any[],
    machines: [] as { id: number; mac: string; sn: string }[],
    silos: [] as { id: number; name: string }[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchHouse(payload: any) {
      this.loading = true
      try {
        const res = await getHouse(payload)
        this.houselist = res.data.list
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

    async addHouse(houseData: any) {
      try {
        const res = await createHouse(houseData)
        return res
      } catch (err: any) {
        this.error = err.message
      }
    },

    async fetchHouseSummary(payload: any) {
      this.loading = true
      try {
        const res = await getHouseSummary(payload)
        this.houseSummary = res.data
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchHouseWeekly(payload: any) {
      getHouseWeekly
      this.loading = true
      try {
        const res = await getHouseWeekly(payload)
        this.houseWeekly = res.data
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchHouseCVHistory(payload: any) {
      getHouseCVHistory
      this.loading = true
      try {
        const res = await getHouseCVHistory(payload)
        this.houseCVHistory = res.data
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchMachineAvailable() {
      getHouseCVHistory
      this.loading = true
      try {
        const res = await getMachineAvailable()
        this.machines = res.data
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchMachineSilos() {
      getHouseCVHistory
      this.loading = true
      try {
        const res = await getMachineSilos()
        this.silos = res.data
        return res
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    clearHouseCVHistory() {
      this.houseCVHistory = []
    },

    clearHouseSummary() {
      this.houseSummary = { ...defaultHouseSummary }
    },

    clearHouseAll() {
      this.houseCVHistory = []
      this.houseSummary = { ...defaultHouseSummary }
      this.houseWeekly = []
    },
  },
})
