import { createUser, deleteUser, getAllUsers, updateUserApi } from '@/services/adminService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('adminStore', () => {
  const users = ref<any[]>([])
  const loading = ref(false)

  // 👉 ดึงข้อมูล Users ทั้งหมด
  const fetchUsers = async () => {
    loading.value = true
    try {
      const res = await getAllUsers()

      users.value = res?.data || []
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 👉 สร้าง User ใหม่
  const createNewUser = async (payload: any) => {
    try {
      const res = await createUser(payload)

      await fetchUsers()

      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  // 👉 อัปเดต User
  const updateUser = async (payload: { id: string; data: any }) => {
    try {
      const res = await updateUserApi(payload)

      await fetchUsers()

      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  // 👉 ลบ User
  const removeUser = async (payload: any) => {
    try {
      const res = await deleteUser(payload)

      await fetchUsers()

      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return {
    users,
    loading,
    fetchUsers,
    createNewUser,
    updateUser,
    removeUser,
  }
})
