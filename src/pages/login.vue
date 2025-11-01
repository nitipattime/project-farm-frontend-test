<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/auth'

import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'

const router = useRouter()
const auth = useAuthStore()
const vuetifyTheme = useTheme()

// form state
const username = ref('')
const password = ref('')
const error = ref('')
const isPasswordVisible = ref(false)
const formRef = ref()

// theme mask
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

// ✅ Validation Rules
const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.[^\n\r@\u2028\u2029]*@.+\..+/.test(v) || 'Invalid email format',
  min: (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
}

async function handleLogin() {
  // ตรวจสอบว่าฟอร์มผ่าน validation มั้ย
  const isValid = await formRef.value?.validate()
  if (!isValid)
    return

  const success = await auth.login(username.value, password.value)
  if (success)
    router.push('/dashboardV2')
  else
    error.value = 'Invalid credentials'
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <RouterLink
          to="/"
          class="d-flex align-center gap-3"
        >
          <div
            class="d-flex"
            v-html="logo"
          />
          <!-- <h2 class="font-weight-medium text-2xl text-uppercase">Materio</h2> -->
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
        <VForm
          ref="formRef"
          @submit.prevent="handleLogin"
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="username"
                label="Username"
                type="email"
                :rules="[rules.required, rules.email]"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :rules="[rules.required, rules.min]"
              >
                <template #append-inner>
                  <VIcon
                    :icon="isPasswordVisible ? 'ri-eye-line' : 'ri-eye-off-line'"
                    class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible"
                  />
                </template>
              </VTextField>
            </VCol>

            <!-- error -->
            <VCol
              v-if="error"
              cols="12"
            >
              <p class="text-error text-center mt-2">
                {{ error }}
              </p>
            </VCol>

            <!-- login button -->
            <VCol cols="12">
              <VBtn
                block
                type="submit"
              >
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!--
      <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />
      <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />
      <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
    -->
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
