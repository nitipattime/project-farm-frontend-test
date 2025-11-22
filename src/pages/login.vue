<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import logo from '@images/pages/original-logo.png'

const router = useRouter()
const auth = useAuthStore()

// form state
const username = ref('')
const password = ref('')
const error = ref('')
const isPasswordVisible = ref(false)
const formRef = ref()

// ✅ Validation Rules
const rules = {
  required: (v: string) => !!v || 'This field is required',

  // อนุญาตให้กรอกได้ทั้ง email และ username
  usernameOrEmail: (v: string) => {
    if (!v)
      return 'This field is required'

    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    const usernameRegex = /^[\w.-]{3,}$/ // ปรับตามต้องการ

    if (emailRegex.test(v) || usernameRegex.test(v))
      return true

    return 'Must be a valid username or email'
  },

  min: (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
}

// const rules = {
//   required: (v: string) => !!v || 'This field is required',
//   email: (v: string) => /.[^\n\r@\u2028\u2029]*@.+\..+/.test(v) || 'Invalid email format',
//   min: (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
// }

async function handleLogin() {
  const isValid = await formRef.value?.validate()
  if (!isValid)
    return

  const success = await auth.login({
    email: username.value,
    password: password.value,
  })

  if (success) {
    await nextTick() // ✅ รอให้ state ของ Pinia อัปเดตเสร็จก่อน

    router.push('/dashboardV2')
  }
  else {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7 login-card">
      <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-3">
          <img :src="logo" alt="logo" width="120">
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          Welcome
        </h4>
        <p class="mb-0">
          Please sign-in to your account
        </p>
      </VCardText>

      <VCardText>
        <VForm ref="formRef" @submit.prevent="handleLogin">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="username" label="Username or Email"
                :rules="[rules.required, rules.usernameOrEmail]" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="password" label="Password" placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'" autocomplete="password"
                :rules="[rules.required, rules.min]">
                <template #append-inner>
                  <VIcon :icon="isPasswordVisible ? 'ri-eye-line' : 'ri-eye-off-line'" class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible" />
                </template>
              </VTextField>
            </VCol>

            <!-- error -->
            <VCol v-if="error" cols="12">
              <p class="text-error text-center mt-2">
                {{ error }}
              </p>
            </VCol>

            <!-- login button -->
            <VCol cols="12">
              <VBtn block type="submit">
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.login-card {
  width: 100%;
  max-width: 600px; // ปรับได้เลย เช่น 550, 580, 620

  @media (min-width: 768px) {
    max-width: 650px;
  }

  @media (min-width: 1024px) {
    max-width: 700px;
  }
}
</style>
