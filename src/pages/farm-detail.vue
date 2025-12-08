<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import { useNumberFormat } from '@/composables/useNumberFormat'
import { useHouseStore } from '@/stores/houseStore'
import imgChicken from '@images/pages/Chicken.png'
import imgFarm from '@images/pages/Farm.png'
import imgHouse from '@images/pages/House.png'
import { useTheme } from 'vuetify'

const props = defineProps<{ id: string }>()

const { formatNumber } = useNumberFormat()

const vuetifyTheme = useTheme()

const farmId = Number.parseInt(props.id || '0', 10)
const router = useRouter()
const dialog = shallowRef(false)
const loaded = ref(false)
const loading = ref(false)
const currentTheme = computed(() => vuetifyTheme.current.value.colors)
const houseStore = useHouseStore()
const searchQuery = ref('')
const page = ref(1)
const pageCount = computed(() => Math.ceil(houseStore.pagination.total / houseStore.pagination.limit))

// const perPage = 6

async function resetPage() {
  page.value = 1 // ✅ reset local page
  houseStore.pagination.page = 1
}

const alert = ref({
  show: false,
  type: 'success', // success, error, info, warning
  message: '',
})

function showAlert(type: string, message: string) {
  alert.value = {
    show: true,
    type,
    message,
  }

  setTimeout(() => {
    alert.value.show = false
  }, 2500) // 2.5 sec
}

async function handleGetCampaignList() {
  const params = {
    search: searchQuery.value,
    page: page.value,
    farm_id: farmId,
  }

  try {
    await houseStore.fetchHouse(params)
    page.value = houseStore.pagination.page
  }
  catch (err) {
    console.error(err)
  }
}

const initialize = async () => {
  resetPage()
  await handleGetCampaignList()
}

onMounted(async () => {
  await initialize()
})

const onPageChange = async (newPage: number) => {
  console.log('Page changed:', newPage)
  page.value = newPage

  // farmStore.pagination.page = newPage
  await handleGetCampaignList()
}

// ข้อมูลฟอร์ม
const farmForm = ref({
  name: '',
  contact: '',
})

// rules
const requiredRule = value => !!value || 'กรุณากรอกข้อมูล'

// go to house deatil
function goToHouseDetail(items: any) {
  console.log(items)

  // router.push('/farmDetail') // หรือใช้ชื่อ route: router.push({ name: 'about' })
  router.push({ name: 'house-detail', params: { id: items.id }, query: { houseName: items.house_name } }) // หรือใช้ชื่อ route: router.push({ name: 'about' })
}

const formRefFarm = ref(null)

function resetForm() {
  farmForm.value = {
    name: '',
    contact: '',
  }
}

async function submitForm() {
  const { valid } = await formRefFarm.value.validate()

  if (!valid) {
    // ❌ ถ้าไม่ผ่าน validation → ไม่บันทึก
    return
  }

  // ✅ ผ่าน validation → ทำงานต่อ
  try {
    const payload = {
      house_name: farmForm.value.name,
      contact_name: farmForm.value.contact,
      farm_id: farmId,
    }

    await houseStore.addHouse(payload)

    dialog.value = false
    resetForm()

    showAlert('success', 'บันทึกข้อมูลโรงเรือนเรียบร้อยแล้ว')
    await initialize()
  }
  catch (error) {
    console.error(error)
    showAlert('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่')
  }
}

const onSearch = async () => {
  loading.value = true

  try {
    resetPage()

    await handleGetCampaignList()
  }
  catch (error) {
    console.error('Search error:', error)
  }
  finally {
    loading.value = false
  }
}

const chartOptions = categories => ({
  chart: {
    height: 150,
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false },
  },

  xaxis: {
    categories,
    labels: { show: false }, // ❌ ซ่อนตัวเลขบนแกน X
    axisTicks: { show: false }, // ❌ ซ่อนขีดบนแกน X
    axisBorder: { show: false }, // ❌ ซ่อนเส้นแกน X
  },

  yaxis: {
    labels: { show: false }, // ❌ ซ่อนตัวเลขแกน Y
    axisTicks: { show: false }, // ❌ ซ่อนขีดบนแกน Y
    axisBorder: { show: false }, // ❌ ซ่อนเส้นแกน Y
  },

  grid: {
    show: false, // ❌ ซ่อนเส้น Grid ทั้งหมด
  },

  stroke: {
    curve: 'smooth',
    width: 3,
  },

  markers: {
    size: 4,
  },

  tooltip: {
    shared: true,
    intersect: false,
  },
  colors: ['#01ccff',
    currentTheme.value.error,
    currentTheme.value.error,
    currentTheme.value.success],
})
</script>

<template>
  <VOverlay v-model="alert.show" class="d-flex align-center justify-center" scrim>
    <VAlert :type="alert.type" border="start" elevation="2" class="mb-4">
      <strong>{{ alert.message }}</strong>
    </VAlert>
    <!-- <VAlert v-if="alert.show" :type="alert.type" class="mb-4" border="start" elevation="2" /> -->
  </VOverlay>
  <VRow>
    <VCol cols="12">
      <VRow>
        <VCol cols="12" md="4">
          <VCard class="position-relative" md="4">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  ชื่อฟาร์ม
                </h5>
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.summary.farmName }}
              </h4>
            </VCardText>

            <!-- Trophy -->
            <VImg :src="imgFarm" class="trophy" />
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard class="position-relative" md="4">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  จำนวนโรงเรือน
                </h5>
              </div>
              <h4 class="text-h4 text-primary">
                {{ formatNumber(houseStore.summary.totalHouses) }}
              </h4>
            </VCardText>

            <!-- Trophy -->
            <VImg :src="imgHouse" class="trophy" />
          </VCard>
        </VCol>
        <VCol cols="12" md="4">
          <VCard class="position-relative" md="4">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  จำนวนไก่ทั้งหมด
                </h5>
              </div>
              <h4 class="text-h4 text-primary">
                {{ formatNumber(houseStore.summary.totalChicken) }}
              </h4>
            </VCardText>

            <!-- Trophy -->
            <VImg :src="imgChicken" class="trophy" />
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <div class="d-flex justify-space-between align-center mb-6">
          <!-- Search Field -->
          <VTextField v-model="searchQuery" placeholder="ค้นหา" persistent-placeholder :loading="loading"
            append-inner-icon="ri-search-line" clearable hide-details variant="outlined" density="comfortable"
            style="max-width: 300px" @keyup.enter="onSearch" @click:append-inner="onSearch" @click:clear="onSearch" />

          <!-- Create Farm Button -->
          <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="dialog = true">
            เพิ่มโรงเรือน
          </VBtn>
        </div>

        <!-- Course Cards -->
        <VRow class="g-6">
          <VCol v-for="(house, i) in houseStore.houselist" :key="i" cols="12" sm="6" md="4">
            <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">
              <template #prepend>
                <VCardTitle class="text-h5">
                  ชื่อโรงเรือน : {{ house.house_name ? house.house_name : '-' }}
                </VCardTitle>
              </template>
              <VCardTitle class="text-h6 px-5">
                ชื่อผู้ดูแล : {{ house.contact_name ? house.contact_name : '-' }}
              </VCardTitle>
              <VCardTitle class="text-h6 px-5">
                ระยะเวลาเพาะเลี้ยงรวม : {{ house.duration_days ? house.duration_days : '0' }} วัน
              </VCardTitle>

              <template #append>
                <!--
                  <VChip :color="house.status === 'อยู่ระหว่างการเพาะเลี้ยง' ? 'info' : 'success'" size="small" label>
                  {{ house.status ? house.status : '' }}
                  </VChip>
                -->
                <VChip v-if="house.status === 'สิ้นสุดการเพาะเลี้ยง' || house.status === 'อยู่ระหว่างการเพาะเลี้ยง'"
                  :color="house.status === 'สิ้นสุดการเพาะเลี้ยง' ? 'success' : 'info'" size="small" label>
                  {{ house.status }}
                </VChip>
              </template>

              <VRow class="mt-2" align="center" justify="space-between">
                <VCol cols="6">
                  <p>วันที่เริ่มต้น {{ house.start_date ? house.start_date.split("T")[0] : '--/--/--' }}</p>
                </VCol>

                <VCol cols="6" class="text-right">
                  <p>วันที่สิ้นสุด {{ house.end_date ? house.end_date.split("T")[0] : '--/--/--' }}</p>
                </VCol>
              </VRow>

              <VueApexCharts
                v-if="house.chartSeries && house.chartSeries.length && house.chartCategories && house.chartCategories.length"
                type="line" :options="chartOptions(house.chartCategories)" :series="house.chartSeries" height="200" />

              <VCardActions class="justify-space-between pt-0">
                <VBtn color="primary" variant="flat" size="small" @click="goToHouseDetail(house)">
                  View
                </VBtn>
                <!--
                  <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
                  {{ course.status }}
                  </VChip>
                -->
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>

        <!-- No result -->
        <div v-if="houseStore.pagination.totalPages === 0" class="text-center py-10 text-medium-emphasis">
          No courses found.
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
          <VPagination v-model="houseStore.pagination.page" :length="pageCount" total-visible="5"
            @update:model-value="onPageChange" />
        </div>
      </VCard>
    </VCol>
  </VRow>

  <div class="pa-4 text-center">
    <VDialog v-model="dialog" max-width="600">
      <VCard>
        <VCardTitle class="text-h6 text-md-h5 text-lg-h4 mt-2">
          ข้อมูลโรงเรือน
        </VCardTitle>
        <VCardText>กรอกข้อมูลโรงเรือนให้ครบถ้วน</VCardText>

        <VForm ref="formRefFarm">
          <!-- ✅ เริ่มต้น VForm -->
          <VDivider />

          <VCardText class="mt-6">
            <VRow dense>
              <VCol cols="12" md="12" sm="6">
                <VTextField v-model="farmForm.name" label="ชื่อโรงเรือน" :rules="[requiredRule]" required />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText>
            <VRow dense>
              <VCol cols="12" md="12" sm="6">
                <VTextField v-model="farmForm.contact" label="ชื่อผู้ติดต่อ" :rules="[requiredRule]" required />
              </VCol>
            </VRow>
          </VCardText>
        </VForm> <!-- ✅ ปิด VForm -->

        <VDivider />

        <VCardText class="mt-3">
          * กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนทำการบันทึก
        </VCardText>

        <VCardActions class="my-1 justify-center">
          <VBtn text="Close" variant="plain" @click="dialog = false" />
          <VBtn color="primary" text="Save" variant="tonal" @click="submitForm" />
        </VCardActions>
      </VCard>
    </VDialog>
  </div>

  <!--
    <VSnackbar v-model="showAlert" :color="alertType" timeout="2000">
    {{ alertMessage }}
    </VSnackbar>
  -->
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

.v-card .trophy {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
}
</style>
