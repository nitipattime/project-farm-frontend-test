<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useRealtime } from '@/composables/useSocket'
import { getExport } from '@/services/exportService'
import { markHouseFinish } from '@/services/houseService'
import { useHouseStore } from '@/stores/houseStore'
import AnalyticsSalesByCountriesV2 from '@/views/dashboard/AnalyticsSalesByCountriesV2.vue'
import TestV2 from '@/views/dashboard/TestV2.vue'

const props = defineProps<{ id: string }>()

const houseStore = useHouseStore()
const router = useRouter()
const houseId = Number.parseInt(props.id || '0', 10)
const { scalesData } = useRealtime(houseId)

const dialog = shallowRef(false)
const loaded = ref(false)
const loading = ref(false)

function onClick() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 2000)
}

const filters = ['All Courses', 'Ongoing', 'Completed']
const selectedFilter = ref('All Courses')

const searchQuery = ref('')
const page = ref(1)
const perPage = 6

const courses = ref([
  { id: 1, title: 'Vue Basics', category: 'Frontend', status: 'Ongoing' },
  { id: 2, title: 'Golang Clean Architecture', category: 'Backend', status: 'Completed' },
])

// pagination that respects filtering
const filteredCourses = computed(() => {
  if (selectedFilter.value === 'All Courses')
    return courses.value

  return courses.value.filter(course => course.status === selectedFilter.value)
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredCourses.value.length / perPage)))

const paginatedCourses = computed(() => {
  const filtered = filteredCourses.value
  const start = (page.value - 1) * perPage
  const end = start + perPage

  return filtered.slice(start, end)
})

const fetchCourses = () => {
  console.log('Searching:', searchQuery.value)
}

const onPageChange = (newPage: number) => {
  page.value = newPage
  console.log('Page changed:', newPage)
}

// ข้อมูลฟอร์ม
const farmForm = ref({
  name: '',
  contact: '',
  zip_code: '',
  province_id: 0,
  district_id: 0,
  subdistrict_id: 0,
})

// rules
const requiredRule = (value: any) => !!value || 'กรุณากรอกข้อมูล'
const postcodeRule = (value: string) => (/^\d{5}$/).test(value) || 'รหัสไปรษณีย์ต้องมี 5 หลัก'

// mock dropdown data (replace with API calls if needed)
const provinces = ref([
  { id: 1, name: 'กรุงเทพมหานคร' },
  { id: 2, name: 'เชียงใหม่' },
  { id: 3, name: 'ชลบุรี' },
])

const districts: Record<number, { id: number; name: string }[]> = {
  1: [{ id: 11, name: 'เขตพระนคร' }, { id: 12, name: 'เขตดุสิต' }],
  2: [{ id: 21, name: 'อำเภอเมืองเชียงใหม่' }, { id: 22, name: 'อำเภอสันกำแพง' }],
  3: [{ id: 31, name: 'อำเภอเมืองชลบุรี' }, { id: 32, name: 'อำเภอบางละมุง' }],
}

const subdistricts: Record<number, { id: number; name: string }[]> = {
  11: [{ id: 111, name: 'พระบรมมหาราชวัง' }, { id: 112, name: 'วังบูรพา' }],
  12: [{ id: 121, name: 'ดุสิต' }, { id: 122, name: 'วชิรพยาบาล' }],
}

const selectedDistricts = ref<{ id: number; name: string }[]>([])
const selectedSubdistricts = ref<{ id: number; name: string }[]>([])

watch(() => farmForm.value.province_id, newVal => {
  selectedDistricts.value = districts[newVal] || []
  farmForm.value.district_id = 0
  selectedSubdistricts.value = []
  farmForm.value.subdistrict_id = 0
})

watch(() => farmForm.value.district_id, newVal => {
  selectedSubdistricts.value = subdistricts[newVal] || []
  farmForm.value.subdistrict_id = 0
})

function submitForm() {
  console.log('submitForm', farmForm.value)
  dialog.value = false
}

function goToAddHouseDetail() {
  console.log(props.id)
  router.push({ name: 'add-house-detail', query: { id: props.id } })
}

const statistics = computed(() => [
  {
    title: 'Uniform',
    stats: houseStore.houseSummary.uniform ?? '-',
    unit: 'กรัม',
    icon: 'ri-pie-chart-2-line',
    color: 'primary',
  },
  {
    title: 'SD',
    stats: houseStore.houseSummary.sd ?? '-',
    unit: 'กรัม',
    icon: 'ri-pie-chart-2-line',
    color: 'success',
  },
  {
    title: 'CV',
    stats: houseStore.houseSummary.cv ?? '-',
    unit: 'กรัม',
    icon: 'ri-pie-chart-2-line',
    color: 'warning',
  },
  {
    title: 'น้ำหนักโดยเฉลี่ย',
    stats: houseStore.houseSummary.avg_weight ?? '-',
    unit: 'กรัม',
    icon: 'ri-weight-line',
    color: 'info',
  },
  {
    title: 'ปริมาณอาหาร',
    stats: houseStore.houseSummary.weight_target ?? '-',
    unit: 'กรัม',
    icon: 'ri-restaurant-2-line',
    color: 'info',
  },
  {
    title: 'อายุเพาะเลี้ยง',
    stats: houseStore.houseSummary.duration_days ?? '-',
    unit: 'วัน',
    icon: 'ri-time-line',
    color: 'info',
  },
])

const moreList = [
  { title: 'Share', value: 'Share' },
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Update', value: 'Update' },
]

async function handleGetHouseSummary() {
  const params = { houseID: houseId }
  try {
    await houseStore.fetchHouseSummary(params)
  }
  catch (err) {
    console.error(err)
  }
}

async function handleGetHouseWeekly() {
  const params = { houseID: houseId }
  try {
    await houseStore.fetchHouseWeekly(params)
  }
  catch (err) {
    console.error(err)
  }
}

async function handleGetHouseWeightChart() {
  const params = { houseID: houseId }
  try {
    await houseStore.fetchHouseWeightChart(params)
  }
  catch (err) {
    console.error(err)
  }
}

async function handleGetExport() {
  // const params = { houseID: houseId }
  try {
    const response = await getExport({ houseID: houseId })

    // console.log('Headers:', response.headers)
    // console.log('CD:', response.headers['content-disposition'])

    // สร้าง Blob จาก response
    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })

    const url = window.URL.createObjectURL(blob)

    // --- ดึงชื่อไฟล์จาก content-disposition ---
    let fileName = 'report.xlsx'
    const cd = response.headers['content-disposition']

    if (cd) {
      const match = cd.match(/filename="?([^"]+)"?/)
      if (match && match[1])
        fileName = match[1]
    }

    // --- สร้างลิงก์ดาวน์โหลด ---
    const link = document.createElement('a')

    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    // cleanup
    link.remove()
    window.URL.revokeObjectURL(url)

    // const response = await getExport(params)

    // const blob = new Blob([response.data], {
    //   type: response.headers['content-type'],
    // })

    // const url = window.URL.createObjectURL(blob)

    // const link = document.createElement('a')

    // link.href = url
    // link.download = `report_${houseId}.xlsx` // 👈 ตั้งชื่อไฟล์ที่ต้องการ
    // link.click()

    // window.URL.revokeObjectURL(url)
  }
  catch (err) {
    console.error(err)
  }
}

const labels = ref<string[]>([])
const chartData = ref<number[]>([])
async function handleGetHouseCVHistory() {
  const params = { houseID: houseId }
  try {
    await houseStore.fetchHouseCVHistory(params)

    const dataFromBackend = houseStore.houseCVHistory || []

    labels.value = dataFromBackend.map((item: any) => `${item.year}-${item.month}`)
    chartData.value = dataFromBackend.map((item: any) => Number(Number(item.cv).toFixed(3)))
  }
  catch (err) {
    console.error(err)
  }
}
const confirmDialog = ref(false)

async function handleConfirmMarkHouseFinish() {
  try {
    const result = await markHouseFinish(props.id)

    if (result)
      confirmDialog.value = false // ปิด dialog หลังบันทึกสำเร็จ
  }
  catch (err) {
    confirmDialog.value = false
    console.error(err)
  }
}

const initialize = async () => {
  await handleGetHouseSummary()
  await handleGetHouseWeekly()
  await handleGetHouseCVHistory()
  await handleGetHouseWeightChart()
}

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="">
        <template #subtitle>
          <div class="text-h5 mb-0 flex items-center gap-2">
            <span class="font-weight-medium text-high-emphasis">ชื่อฟาร์ม: </span>
            <span class="text-grey-600">{{ houseStore.houseSummary.farm_name || '-' }}</span>
          </div>
          <div class="text-h5 mb-0 flex items-center gap-2">
            <span class="font-weight-medium text-high-emphasis">ชื่อโรงเรือน: </span>
            <span class="text-grey-600">{{ houseStore.houseSummary.house_name || '-' }}</span>
          </div>
          <div class="text-h5 mb-0 flex items-center gap-2">
            <span class="font-weight-medium text-high-emphasis">ข้อมูลสายพันธ์: </span>
            <span class="text-grey-600">{{ houseStore.houseSummary.breed || '-' }}</span>
          </div>
          <div class="text-h5 mb-0 flex items-center gap-2">
            <span class="font-weight-medium text-high-emphasis">เพศ: </span>
            <span class="text-grey-600">{{ houseStore.houseSummary.sex || '-' }}</span>
          </div>
        </template>

        <template #append>
          <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="handleGetExport">
            Export
          </VBtn>
        </template>

        <VCardText class="pt-1">
          <VRow>
            <VCol v-for="item in statistics" :key="item.title" cols="12" sm="2" md="2">
              <div class="d-flex align-center gap-x-3">
                <VAvatar :color="item.color" rounded size="40" class="elevation-2">
                  <VIcon size="24" :icon="item.icon" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <div class="text-h5">
                    {{ item.title }}
                  </div>
                  <h5 class="text-h5 text-grey-600">
                    {{ item.stats }} {{ item.unit }}
                  </h5>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VRow>
        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  เครื่องชั่งน้ำหนัก & รุ่น
                </h5>
              </div>
              <h4 class="text-h5 text-primary">
                <div v-if="houseStore.houseSummary.machines && houseStore.houseSummary.machines.length">
                  <div v-for="machine in houseStore.houseSummary.machines" :key="machine.mac">
                    <div class="text-blue-600 text-md">
                      {{ machine.mac }} {{ machine.sn }}
                    </div>
                  </div>
                </div>
              </h4>
            </VCardText>
            <!-- <VImg :src="trophy" class="trophy" /> -->
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  สูตรอาหาร
                </h5>
              </div>
              <h4 class="text-h5 text-primary">
                {{ houseStore.houseSummary.food ?? '-' }}
              </h4>
            </VCardText>
            <!-- <VImg :src="trophy" class="trophy" /> -->
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  วันที่เริ่มต้น
                </h5>
              </div>
              <h4 class="text-h5 text-primary">
                {{ houseStore.houseSummary.start_date ? houseStore.houseSummary.start_date.split('T')[0] : '-' }}
              </h4>
            </VCardText>
            <!-- <VImg :src="trophy" class="trophy" /> -->
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  วันที่คาดว่าจะสิ้นสุด
                </h5>
              </div>
              <h4 class="text-h5 text-primary">
                {{ houseStore.houseSummary.end_date ? houseStore.houseSummary.end_date.split('T')[0] : '-' }}
              </h4>
            </VCardText>
            <!-- <VImg :src="trophy" class="trophy" /> -->
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  วันที่สิ้นสุดจริง
                </h5>
              </div>
              <h4 class="text-h5 text-primary">
                {{ houseStore.houseSummary.actual_end_date ? houseStore.houseSummary.actual_end_date.split('T')[0] : '-'
                }}
              </h4>
            </VCardText>
            <!-- <VImg :src="trophy" class="trophy" /> -->
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  สถานะการทำงาน
                </h5>
              </div>
              <h4 class="text-h5 text-primary">
                {{ houseStore.houseSummary.statusDisplay ?? '-' }}
              </h4>
            </VCardText>
            <!-- <VImg :src="trophy" class="trophy" /> -->
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <div class="d-flex justify-end align-center mb-6">
          <VBtn color="primary" class="text-white me-2" @click="goToAddHouseDetail">
            เพิ่มรายละเอียด
          </VBtn>

          <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="confirmDialog = true">
            สิ้นสุดการเลี้ยง
          </VBtn>
        </div>

        <VRow class="g-6">
          <VCol v-for="machine in scalesData.machines"
            v-if="scalesData && scalesData.machines && scalesData.machines.length" :key="machine.scale_name" cols="12"
            sm="6" md="6">
            <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">
              <h2 class="text-lg font-semibold mb-4">
                Table by Scale {{ machine.scale_name }}
              </h2>

              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b text-left text-gray-700">
                      <th class="py-2 px-3">
                        Scale No.
                      </th>
                      <th class="py-2 px-3">
                        Mean Weight (g)
                      </th>
                      <th class="py-2 px-3">
                        SD
                      </th>
                      <th class="py-2 px-3">
                        CV%
                      </th>
                      <th class="py-2 px-3">
                        Count
                      </th>
                    </tr>
                  </thead>

                  <tbody class="text-gray-800">
                    <tr v-for="row in machine.data" :key="row.scale_id" class="border-b">
                      <td class="py-2 px-3">
                        {{ row.scale_no }}
                      </td>
                      <td class="py-2 px-3">
                        {{ Number(row.mean_weight).toFixed(4) }}
                      </td>
                      <td class="py-2 px-3">
                        {{ Number(row.sv).toFixed(4) }}
                      </td>
                      <td class="py-2 px-3">
                        {{ Number(row.cv).toFixed(4) }}
                      </td>
                      <td class="py-2 px-3">
                        {{ row.count }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </VCard>
          </VCol>

          <VCol v-else cols="12">
            <div class="text-center py-6">
              No scale data available.
            </div>
          </VCol>
        </VRow>

        <div v-if="paginatedCourses.length === 0" class="text-center py-10 text-medium-emphasis">
          No courses found.
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

  <VRow>
    <VCol cols="12" md="9">
      <TestV2 :data="houseStore.houseWeightChart" />
    </VCol>
    <VCol cols="12" md="3">
      <AnalyticsSalesByCountriesV2 :data="houseStore.houseWeekly" />
    </VCol>
  </VRow>

  <VDialog v-model="confirmDialog" max-width="400">
    <VCard>
      <VCardTitle class="text-h6">
        ยืนยันสิ้นสุดการเลี้ยง
      </VCardTitle>
      <VCardText>
        คุณต้องการสิ้นสุดการเลี้ยงใช่หรือไม่?
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" @click="confirmDialog = false">
          ยกเลิก
        </VBtn>
        <VBtn color="primary" @click="handleConfirmMarkHouseFinish">
          ยืนยันสิ้นสุดการเลี้ยง
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
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
