<script setup lang="ts">
import { ref } from 'vue'

const loaded = ref(false)
const loading = ref(false)

function onClick() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 2000)
}

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VRow>
          <!-- Column 1: รูป -->
          <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
            <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
            <VCardTitle>3</VCardTitle>
            <VCardTitle>โรงเรือน</VCardTitle>
          </VCol>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <!-- Column 2: ชื่อสินค้า -->
          <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
            <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
            <VCardTitle>3</VCardTitle>
            <VCardTitle>โรงเรือน</VCardTitle>
          </VCol>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <!-- Column 3: ราคา + ปุ่ม -->
          <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
            <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
            <VCardTitle>3</VCardTitle>
            <VCardTitle>โรงเรือน</VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <v-card-text>
          <v-text-field base-color="black" :loading="loading" append-inner-icon="mdi-magnify" density="compact"
            label="Search" variant="solo" hide-details single-line @click:append-inner="onClick"></v-text-field>
          <v-text-field class="black-label" :loading="loading" append-inner-icon="mdi-magnify" density="compact"
            label="Search templates" variant="solo" hide-details single-line
            @click:append-inner="onClick"></v-text-field>
          <v-text-field color="on-surface" class="text-black" :loading="loading" append-inner-icon="mdi-magnify"
            density="compact" label="Search templates" hide-details single-line @click:append-inner="onClick" />
          <VTextField prepend-inner-icon="ri-user-line" label="First Name" placeholder="John" />

          <VTextField id="firstName" placeholder="John" persistent-placeholder :loading="loading"
            append-inner-icon="mdi-magnify" @click:append-inner="onClick" />
        </v-card-text>
      </VCard>
    </VCol>

  </VRow>


</template>

<style scoped>
.black-label .v-field-label {
  color: black !important;
}

.text-black .v-field-label {
  color: #000 !important;
  opacity: 1 !important;
}

.text-black .v-icon {
  color: #000 !important;
}

.text-black input {
  color: #000 !important;
}
</style>
