<script setup lang="ts">
import { ref } from 'vue'

// 👉 Mock data จาก API
const users = ref([
    {
        id: 1,
        email: 'john@example.com',
        username: 'john',
        role: 'admin',
        isActive: true,
        createdAt: '2025-11-17T16:36:09.523Z',
    },
    {
        id: 2,
        email: 'jane@example.com',
        username: 'jane',
        role: 'user',
        isActive: false,
        createdAt: '2025-11-17T16:40:22.000Z',
    },
])

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
        ...item,
        password: '', // แก้ไข จะไม่โชว์ password เดิม
    }
    dialog.value = true
}

// 👉 Create / Update
function saveUser() {
    if (isEdit.value) {
        // Update
        const index = users.value.findIndex(u => u.id === form.value.id)

        users.value[index] = { ...users.value[index], ...form.value }
    }
    else {
        // Create
        const newUser = {
            ...form.value,
            id: Date.now(),
            createdAt: new Date().toISOString(),
        }

        users.value.push(newUser)
    }

    dialog.value = false
}

// 👉 Delete user
function deleteUser(id: number) {
    users.value = users.value.filter(u => u.id !== id)
}
</script>

<template>
    <div class="p-4">
        <!-- 👉 Header + Create button -->
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-h5">
                User Management
            </h2>

            <VBtn color="primary" @click="openCreate">
                Create User
            </VBtn>
        </div>

        <!-- 👉 Table -->
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
                <tr v-for="item in users" :key="item.id">
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

                        <VBtn icon variant="text" color="error" @click="deleteUser(item.id)">
                            <VIcon icon="ri-delete-bin-line" />
                        </VBtn>
                    </td>
                </tr>
            </tbody>
        </VTable>

        <!-- 👉 Dialog -->
        <VDialog v-model="dialog" max-width="500">
            <VCard>
                <VCardTitle>
                    {{ isEdit ? 'Update User' : 'Create User' }}
                </VCardTitle>

                <VCardText>
                    <VTextField v-model="form.email" label="Email" required />

                    <VTextField v-model="form.username" label="Username" required />

                    <!-- password แสดงเฉพาะตอน create หรือถ้าต้องการ update password -->
                    <VTextField v-if="!isEdit" v-model="form.password" label="Password" type="password" required />

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
    </div>
</template>
