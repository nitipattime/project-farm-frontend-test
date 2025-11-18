<script setup lang="ts">
import { useAdminStore } from '@/stores/adminStore'
import { onMounted, ref } from 'vue'

const usersStore = useAdminStore()

// 👉 Dialog
const dialog = ref(false)
const isEdit = ref(false)

const form = ref({
    id: null,
    email: '',
    username: '',
    password: '',
    role: 'user',
    isActive: true,
})

// 👉 โหลดข้อมูลตอนเปิดหน้า
onMounted(() => {
    usersStore.fetchUsers()
})

// 👉 เปิด dialog สำหรับสร้าง user
function openCreate() {
    isEdit.value = false
    form.value = {
        id: null,
        email: '',
        username: '',
        password: '',
        role: 'user',
        isActive: true,
    }
    dialog.value = true
}

// 👉 เปิด dialog สำหรับแก้ไข user
function openEdit(item: any) {
    isEdit.value = true
    form.value = {
        id: item.id,
        email: item.email,
        username: item.username,
        password: '',
        role: item.role,
        isActive: item.isActive,
    }
    dialog.value = true
}

// 👉 Save (Create / Update)
async function saveUser() {
    try {
        if (isEdit.value) {
            console.log(form.value.id)

            // Update API
            await usersStore.updateUser({
                id: form.value.id,
                data: {
                    email: form.value.email,
                    username: form.value.username,
                    role: form.value.role,
                    isActive: form.value.isActive,
                },
            })
        }
        else {
            // Create API
            await usersStore.createNewUser({
                email: form.value.email,
                username: form.value.username,
                password: form.value.password,
                role: form.value.role,
                isActive: form.value.isActive,
            })
        }

        dialog.value = false
    }
    catch (e) {
        console.error(e)
    }
}

// 👉 Delete user
async function deleteUser(item: any) {
    console.log(item.id)
    try {
        await usersStore.removeUser({
            id: item.id, // ← backend ใช้ชื่อ farm_id
            // password: '1234', // ← ถ้าต้องใช้ password ให้ส่งตามจริง
        })
    }
    catch (e) {
        console.error(e)
    }
}

// 👉 Delete Confirmation
const deleteDialog = ref(false)
const userToDelete = ref<any>(null)

function confirmDeleteUser(item: any) {
    userToDelete.value = item
    deleteDialog.value = true
}

async function deleteUserConfirmed() {
    try {
        await usersStore.removeUser({
            id: userToDelete.value.id,
        })

        deleteDialog.value = false
        userToDelete.value = null
    }
    catch (e) {
        console.error(e)
    }
}
</script>

<template>
    <VRow>
        <VCol cols="12">
            <VCard title="เพิ่มรายละเอียดการเพาะเลี้ยง" class="pa-4">
                <div class="p-4">
                    <!-- Header -->
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-h5">
                            User Management
                        </h2>
                        <VBtn color="primary" @click="openCreate">
                            Create User
                        </VBtn>
                    </div>

                    <!-- Table -->
                    <VTable>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th class="text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in usersStore.users" :key="item.id">
                                <td>{{ item.email }}</td>
                                <td>{{ item.username }}</td>
                                <td>{{ item.role }}</td>

                                <td>
                                    <VChip :color="item.isActive ? 'success' : 'error'" size="small">
                                        {{ item.isActive ? 'Active' : 'Inactive' }}
                                    </VChip>
                                </td>

                                <td>{{ new Date(item.createdAt).toLocaleString() }}</td>

                                <td class="text-center">
                                    <VBtn icon variant="text" color="info" @click="openEdit(item)">
                                        <VIcon icon="ri-edit-line" />
                                    </VBtn>

                                    <VBtn icon variant="text" color="error" @click="confirmDeleteUser(item)">
                                        <VIcon icon="ri-delete-bin-line" />
                                    </VBtn>
                                </td>
                            </tr>
                        </tbody>
                    </VTable>

                    <!-- Dialog -->
                    <VDialog v-model="dialog" max-width="500">
                        <VCard>
                            <VCardTitle>
                                {{ isEdit ? 'Update User' : 'Create User' }}
                            </VCardTitle>

                            <VCardText>
                                <VTextField v-model="form.email" label="Email" required />
                                <VTextField v-model="form.username" label="Username" required />

                                <VTextField v-if="!isEdit" v-model="form.password" label="Password" type="password"
                                    required />

                                <VSelect v-model="form.role" label="Role" :items="['admin', 'user']" required />

                                <VSwitch v-model="form.isActive" label="Active" />
                            </VCardText>

                            <VCardActions>
                                <VBtn variant="text" @click="dialog = false">
                                    Cancel
                                </VBtn>
                                <VBtn color="primary" @click="saveUser">
                                    Save
                                </VBtn>
                            </VCardActions>
                        </VCard>
                    </VDialog>

                    <VDialog v-model="deleteDialog" max-width="420">
                        <VCard>
                            <VCardTitle class="text-h6">
                                Confirm Delete
                            </VCardTitle>

                            <VCardText>
                                คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?<br>
                                <strong>{{ userToDelete?.email }}</strong>
                            </VCardText>

                            <VCardActions>
                                <VBtn variant="text" @click="deleteDialog = false">
                                    Cancel
                                </VBtn>

                                <VBtn color="error" @click="deleteUserConfirmed">
                                    Delete
                                </VBtn>
                            </VCardActions>
                        </VCard>
                    </VDialog>
                </div>
            </VCard>
        </VCol>
    </VRow>
</template>
