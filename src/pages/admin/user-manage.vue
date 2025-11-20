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
            <VCard class="pa-6">
                <!-- Header -->
                <div class="d-flex justify-space-between align-center mb-6">
                    <div>
                        <h2 class="text-h6 font-weight-bold">
                            User Management
                        </h2>
                        <p class="text-body-2 text-medium-emphasis">
                            Manage system users, permissions, and access.
                        </p>
                    </div>

                    <VBtn color="primary" prepend-icon="ri-add-line" @click="openCreate">
                        Create User
                    </VBtn>
                </div>

                <!-- Table -->
                <VTable density="comfortable">
                    <thead class="bg-grey-lighten-4">
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
                            <td class="text-capitalize">
                                {{ item.role }}
                            </td>

                            <td>
                                <VChip size="small" :color="item.isActive ? 'success' : 'error'" variant="flat">
                                    {{ item.isActive ? 'Active' : 'Inactive' }}
                                </VChip>
                            </td>

                            <td>{{ new Date(item.createdAt).toLocaleString() }}</td>

                            <td class="text-center">
                                <VBtn icon variant="text" color="primary" @click="openEdit(item)">
                                    <VIcon icon="ri-edit-line" />
                                </VBtn>

                                <VBtn icon variant="text" color="error" @click="confirmDeleteUser(item)">
                                    <VIcon icon="ri-delete-bin-line" />
                                </VBtn>
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </VCard>
        </VCol>
    </VRow>

    <!-- Create / Update Dialog -->
    <VDialog v-model="dialog" max-width="480">
        <VCard class="pa-2">
            <VCardTitle class="text-h6 font-weight-bold">
                {{ isEdit ? 'Update User' : 'Create New User' }}
            </VCardTitle>

            <VCardText class="mt-2">
                <div class="d-flex flex-column gap-4">
                    <VTextField v-model="form.email" label="Email" variant="outlined" density="comfortable" />
                    <VTextField v-model="form.username" label="Username" variant="outlined" density="comfortable" />

                    <VTextField v-if="!isEdit" v-model="form.password" type="password" label="Password"
                        variant="outlined" density="comfortable" />

                    <VSelect v-model="form.role" :items="['admin', 'user']" label="Role" variant="outlined"
                        density="comfortable" />

                    <VSwitch v-model="form.isActive" label="Active" />
                </div>
            </VCardText>

            <VCardActions class="d-flex justify-end">
                <VBtn variant="text" @click="dialog = false">
                    Cancel
                </VBtn>

                <VBtn color="primary" @click="saveUser">
                    Save
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="420">
        <VCard class="pa-2">
            <VCardTitle class="text-h6 font-weight-bold">
                Confirm Delete
            </VCardTitle>

            <VCardText class="text-body-2 mt-1">
                คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?<br>
                <strong>{{ userToDelete?.email }}</strong>
            </VCardText>

            <VCardActions class="d-flex justify-end">
                <VBtn variant="text" @click="deleteDialog = false">
                    Cancel
                </VBtn>

                <VBtn color="error" @click="deleteUserConfirmed">
                    Delete
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
