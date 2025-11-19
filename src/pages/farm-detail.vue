<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useHouseStore } from '@/stores/houseStore'
import imgChicken from '@images/pages/Chicken.png'
import imgFarm from '@images/pages/Farm.png'
import imgHouse from '@images/pages/House.png'
import { useTheme } from 'vuetify'

const props = defineProps<{ id: string }>()

const vuetifyTheme = useTheme()

const farmId = Number.parseInt(props.id || '0', 10)
const router = useRouter()
const dialog = shallowRef(false)
const loaded = ref(false)
const loading = ref(false)
const houseStore = useHouseStore()
const searchQuery = ref('')
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

function onClick() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 2000)
}

const filters = ['All Courses', 'Ongoing', 'Completed']
const selectedFilter = ref('All Courses')

async function handleGetCampaignList() {
  const params = {
    search: searchQuery.value,
    page: houseStore.pagination.page,
    farm_id: farmId,
  }

  try {
    await houseStore.fetchHouse(params)
  }
  catch (err) {
    console.error(err)
  }
}

const initialize = async () => {
  await handleGetCampaignList()
}

onMounted(async () => {
  await initialize()
})

const page = ref(1)
const perPage = 6

const courses = ref([
  { id: 1, title: 'Vue Basics', category: 'Frontend', status: 'Ongoing' },
  { id: 2, title: 'Golang Clean Architecture', category: 'Backend', status: 'Completed' },
  { id: 3, title: 'Docker for Developers', category: 'DevOps' },
  { id: 4, title: 'Advanced Vuetify', category: 'Frontend' },
  { id: 5, title: 'REST & gRPC APIs', category: 'Backend' },
  { id: 6, title: 'SQL Performance Tuning', category: 'Database' },
  { id: 7, title: 'CI/CD with GitLab', category: 'DevOps' },
  { id: 8, title: 'Tailwind UI Design', category: 'Frontend' },
  { id: 9, title: 'Intro to Physics', category: 'Science' },
])

const pageCount = computed(() => Math.ceil(houseStore.pagination.total / houseStore.pagination.limit))

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * perPage
  const end = start + perPage

  return courses.value.slice(start, end)
})

const fetchCourses = () => {
  console.log('Searching:', searchQuery.value)
}

const onPageChange = async (newPage: number) => {
  console.log('Page changed:', newPage)
  page.value = newPage

  // farmStore.pagination.page = newPage
  await handleGetCampaignList()
}

const filteredCourses = computed(() => {
  if (selectedFilter.value === 'All Courses')
    return courses.value

  return courses.value.filter(course => course.status === selectedFilter.value)
})

// ข้อมูลฟอร์ม
const farmForm = ref({
  name: '',
  contact: '',
})

// rules
const requiredRule = value => !!value || 'กรุณากรอกข้อมูล'
const postcodeRule = value => /^\d{5}$/.test(value) || 'รหัสไปรษณีย์ต้องมี 5 หลัก'

// ข้อมูล dropdown
const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ชลบุรี'] // ตัวอย่าง

const districts = {
  กรุงเทพมหานคร: ['เขตพระนคร', 'เขตดุสิต'],
  เชียงใหม่: ['อำเภอเมืองเชียงใหม่', 'อำเภอสันกำแพง'],
  ชลบุรี: ['อำเภอเมืองชลบุรี', 'อำเภอบางละมุง'],
}

const subdistricts = {
  เขตพระนคร: ['พระบรมมหาราชวัง', 'วังบูรพา'],
  เขตดุสิต: ['ดุสิต', 'วชิรพยาบาล'],
}

// watch province/district เพื่อ update dropdown
const selectedDistricts = ref([])
const selectedSubdistricts = ref([])

watch(() => farmForm.value.province, newVal => {
  selectedDistricts.value = districts[newVal] || []
  farmForm.value.district = ''
  selectedSubdistricts.value = []
  farmForm.value.subdistrict = ''
})

watch(() => farmForm.value.district, newVal => {
  selectedSubdistricts.value = subdistricts[newVal] || []
  farmForm.value.subdistrict = ''
})

// go to house deatil
function goToHouseDetail(items: any) {
  console.log(items)

  // router.push('/farmDetail') // หรือใช้ชื่อ route: router.push({ name: 'about' })
  router.push({ name: 'house-detail', params: { id: items.id } }) // หรือใช้ชื่อ route: router.push({ name: 'about' })
}

const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')

function resetForm() {
  farmForm.value = {
    name: '',
    contact: '',
  }
}

async function submitForm() {
  // ตรวจสอบว่ากรอกครบหรือยัง
  // const { valid } = await formRef.value.validate()

  // if (!valid) {
  //   showAlert.value = true
  //   alertType.value = 'error'
  //   alertMessage.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'

  //   return
  // }

  try {
    const payload = {
      house_name: farmForm.value.name,
      contact_name: farmForm.value.contact,
      farm_id: farmId,

      // zip_code: farmForm.value.zip_code,
    }

    console.log(payload)

    await houseStore.addHouse(payload)

    dialog.value = false
    resetForm()

    // showAlert.value = true
    alertType.value = 'success'
    alertMessage.value = 'บันทึกข้อมูลฟาร์มเรียบร้อยแล้ว'

    setTimeout(() => {
      showAlert.value = true
    }, 250)
  }
  catch (error) {
    showAlert.value = true
    alertType.value = 'error'
    alertMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    console.error(error)
  }
}

const onSearch = async () => {
  console.log(searchQuery.value)

  // ถ้าไม่มีคำค้นหา ก็ไม่ต้องยิง API
  // if (!searchQuery.value.trim())
  //   return

  loading.value = true

  try {
    await handleGetCampaignList()
  }
  catch (error) {
    console.error('Search error:', error)
  }
  finally {
    loading.value = false
  }
}

// const series = [
//   {
//     data: [0, 5, 10, 30, 15, 45, 20, 50, 55, 60, 70, 80, 95, 125, 100, 120, 135, 145, 120, 90, 135, 145, 120, 150, 155, 200, 300, 400, 600, 200, 600, 800],
//   },
//   {
//     data: [0, 100, 200, 300, 15, 45, 20, 50, 55, 60, 70, 80, 95, 125, 100, 120, 135, 145, 120, 90, 135, 145, 120, 150, 155, 200, 300, 400, 600, 200, 600, 800],
//   },
// ]

// const chartOptions = computed(() => {
//   const currentTheme = vuetifyTheme.current.value.colors
//   const variableTheme = vuetifyTheme.current.value.variables

//   return {
//     chart: {
//       parentHeightOffset: 0,
//       toolbar: { show: false },
//     },
//     tooltip: { enabled: false },
//     grid: {
//       borderColor: `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`,
//       strokeDashArray: 6,
//       xaxis: {
//         lines: { show: true },
//       },
//       yaxis: {
//         lines: { show: false },
//       },
//       padding: {
//         top: -10,
//         left: -7,
//         right: 5,
//         bottom: 5,
//       },
//     },
//     stroke: {
//       width: 3,
//       lineCap: 'butt',
//       curve: 'straight',
//     },
//     colors: [currentTheme.primary],
//     markers: {
//       size: 6,
//       offsetY: 4,
//       offsetX: -2,
//       strokeWidth: 3,
//       colors: ['transparent'],
//       strokeColors: 'transparent',
//       discrete: [
//         {
//           size: 5.5,
//           seriesIndex: 0,
//           strokeColor: currentTheme.primary,
//           fillColor: currentTheme.surface,
//           dataPointIndex: series[0].data.length - 1,
//         },
//       ],
//       hover: { size: 7 },
//     },
//     xaxis: {
//       labels: { show: false },
//       axisTicks: { show: false },
//       axisBorder: { show: false },
//     },
//     yaxis: {
//       labels: { show: false },
//     },
//   }
// })

// houseStore.houselist.
// const chartOptions = categories => ({
//   chart: {
//     height: 350,
//     type: 'line',
//     zoom: { enabled: false },
//     toolbar: { show: false },
//   },

//   xaxis: {
//     categories,
//   },

//   stroke: {
//     curve: 'smooth',
//     width: 3,
//   },

//   markers: {
//     size: 4,
//   },

//   tooltip: {
//     shared: true,
//     intersect: false,
//   },

//   yaxis: {
//     labels: {
//       formatter: val => `${val} g`,
//     },
//   },
// })
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
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
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
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.summary.totalHouses }}
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
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.summary.totalChicken }}
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
        <!-- Title -->
        <!--
          <VCardTitle class="text-h5 font-weight-bold mb-2">
          My Courses
          </VCardTitle>
          <VCardSubtitle class="mb-6">
          Here’s a list of your enrolled courses
          </VCardSubtitle>
        -->

        <!-- Search Field -->
        <!--
          <div class="d-flex justify-space-between align-center mb-6">
          <VTextField v-model="searchQuery" placeholder="Search courses" persistent-placeholder :loading="loading"
          append-inner-icon="mdi-magnify" @click:append-inner="onSearch" clearable hide-details variant="outlined"
          density="comfortable" style="max-width: 300px" />
          </div>
        -->
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
              <!-- <VImg :src="course.image" height="180" cover class="rounded mb-4" /> -->

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
              <!--
                <VCardTitle class="text-h6 px-5">
                สถานะการเพาะเลี้ยง : {{ house.status ? house.status : '-' }}
                </VCardTitle>
              -->

              <template #append>
                <VChip :color="house.status === 'อยู่ระหว่างการเพาะเลี้ยง' ? 'info' : 'success'" size="small" label>
                  {{ house.status ? house.status : '' }}
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

              <!-- <VueApexCharts type="line" :options="chartOptions" :series="series" :height="120" class="my-1" /> -->
              <!-- <VueApexCharts type="line" :options="chartOptions" :series="house.chartData" :height="120" class="my-1" /> -->
              <!--
                <VueApexCharts type="line" :options="chartOptions(house.chartCategories)" :series="house.chartSeries"
                height="200" />
              -->
              <VueApexCharts
                v-if="house.chartSeries && house.chartSeries.length && house.chartCategories && house.chartCategories.length"
                type="line" :options="chartOptions(house.chartCategories)" :series="house.chartSeries" height="200" />

              <!--
                <VCardTitle class="text-h6 mb-1">
                {{ course.title }}
                </VCardTitle>
                <VCardSubtitle class="mb-3">
                {{ course.category }}
                </VCardSubtitle>

                <VCardText class="text-body-2 text-truncate mb-5">
                {{ course.description }}
                </VCardText>
              -->

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

  <VSnackbar v-model="showAlert" :color="alertType" timeout="2000">
    {{ alertMessage }}
  </VSnackbar>
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
