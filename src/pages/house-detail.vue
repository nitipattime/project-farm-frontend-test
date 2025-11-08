<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useRealtime } from '@/composables/useSocket'
import { useHouseStore } from '@/stores/houseStore'
import AnalyticsSalesByCountries from '@/views/dashboard/AnalyticsSalesByCountries.vue'
import Test from '@/views/dashboard/Test.vue'

const props = defineProps<{ id: string }>()

const houseStore = useHouseStore()
const router = useRouter()
const houseId = Number.parseInt(props.id || '0', 10)
const { scalesData } = useRealtime(houseId)

// import ShipmentStatisticsCard from '@/layouts/components/ShipmentStatisticsCard.vue'

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

// const courses = ref([
//   {
//     title: 'Introduction to Vue.js 3',
//     category: 'Frontend Development',
//     description: 'Learn Vue.js 3 step by step and build modern web interfaces.',
//     image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
//     status: 'Ongoing',
//   },
//   {
//     title: 'Advanced TypeScript Patterns',
//     category: 'Programming',
//     description: 'Deep dive into generics, decorators, and advanced type inference.',
//     image: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
//     status: 'Completed',
//   },
//   {
//     title: 'Building APIs with Go',
//     category: 'Backend Development',
//     description: 'Learn to build high-performance REST APIs using Golang.',
//     image: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
//     status: 'Ongoing',
//   },
// ])

// paginate

const searchQuery = ref('')
const page = ref(1)
const perPage = 6

const courses = ref([
  { id: 1, title: 'Vue Basics', category: 'Frontend', status: 'Ongoing' },
  { id: 2, title: 'Golang Clean Architecture', category: 'Backend', status: 'Completed' },

  // { id: 3, title: 'Docker for Developers', category: 'DevOps' },
  // { id: 4, title: 'Advanced Vuetify', category: 'Frontend' },
  // { id: 5, title: 'REST & gRPC APIs', category: 'Backend' },
  // { id: 6, title: 'SQL Performance Tuning', category: 'Database' },
  // { id: 7, title: 'CI/CD with GitLab', category: 'DevOps' },
  // { id: 8, title: 'Tailwind UI Design', category: 'Frontend' },
  // { id: 9, title: 'Intro to Physics', category: 'Science' },
])

const pageCount = computed(() => Math.ceil(courses.value.length / perPage))

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * perPage
  const end = start + perPage

  return courses.value.slice(start, end)
})

const fetchCourses = () => {
  console.log('Searching:', searchQuery.value)
}

const onPageChange = (newPage: number) => {
  console.log('Page changed:', newPage)
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
  zip_code: '',
  province_id: 0,
  district_id: 0,
  subdistrict_id: 0,
})

// rules
const requiredRule = value => !!value || 'กรุณากรอกข้อมูล'
const postcodeRule = value => /^\d{5}$/.test(value) || 'รหัสไปรษณีย์ต้องมี 5 หลัก'

// ข้อมูล dropdown
// const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ชลบุรี'] // ตัวอย่าง

// const districts = {
//   กรุงเทพมหานคร: ['เขตพระนคร', 'เขตดุสิต'],
//   เชียงใหม่: ['อำเภอเมืองเชียงใหม่', 'อำเภอสันกำแพง'],
//   ชลบุรี: ['อำเภอเมืองชลบุรี', 'อำเภอบางละมุง'],
// }

// const subdistricts = {
//   เขตพระนคร: ['พระบรมมหาราชวัง', 'วังบูรพา'],
//   เขตดุสิต: ['ดุสิต', 'วชิรพยาบาล'],
// }

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

// submitForm
function submitForm() {
  // ตรวจสอบว่าทุก field ผ่าน validation หรือไม่
  // Vuetify v3 จะ validate อัตโนมัติเมื่อกดปุ่ม Save
  console.log(farmForm.value)
  dialog.value = false
}

// go to add house deatil
function goToAddHouseDetail() {
  console.log(props.id)

  // router.push('/farmDetail') // หรือใช้ชื่อ route: router.push({ name: 'about' })
  router.push({ name: 'add-house-detail', params: { id: props.id } }) // หรือใช้ชื่อ route: router.push({ name: 'about' })
}

const statistics = computed(() => [
  {
    title: 'Uniform',
    stats: houseStore.houseSummary.uniform ? houseStore.houseSummary.uniform : '-',
    unit: 'กรัม',
    icon: 'ri-pie-chart-2-line',
    color: 'primary',
  },
  {
    title: 'SD',
    stats: houseStore.houseSummary.sd ? houseStore.houseSummary.sd : '-',
    unit: 'กรัม',
    icon: 'ri-pie-chart-2-line',
    color: 'success',
  },
  {
    title: 'CV',
    stats: houseStore.houseSummary.cv ? houseStore.houseSummary.cv : '-',
    unit: 'กรัม',
    icon: 'ri-pie-chart-2-line',
    color: 'warning',
  },
  {
    title: 'น้ำหนักโดยเฉลี่ย',
    stats: houseStore.houseSummary.avg_weight ? houseStore.houseSummary.avg_weight : '-',
    unit: 'กรัม',
    icon: 'ri-weight-line',
    color: 'info',
  },
  {
    title: 'ปริมาณอาหาร',
    stats: houseStore.houseSummary.weight_target ? houseStore.houseSummary.weight_target : '-',
    unit: 'กรัม',
    icon: 'ri-restaurant-2-line',
    color: 'info',
  },
  {
    title: 'อายุเพาะเลี้ยง',
    stats: houseStore.houseSummary.duration_days ? houseStore.houseSummary.duration_days : '-',
    unit: 'วัน',
    icon: 'ri-time-line',
    color: 'info',
  },
])

const moreList = [
  { title: 'Share', value: 'Share' },
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Update', value: 'Update' },
  { title: 'Update', value: 'Update' },
  { title: 'Update', value: 'Update' },
]

async function handleGetHouseSummary() {
  const params = {
    houseID: houseId,
  }

  try {
    await houseStore.fetchHouseSummary(params)
  }
  catch (err) {
    console.error(err)
  }
}

async function handleGetHouseWeekly() {
  const params = {
    houseID: houseId,
  }

  try {
    await houseStore.fetchHouseWeekly(params)
  }
  catch (err) {
    console.error(err)
  }
}

const labels = ref<string[]>([])
const chartData = ref<number[]>([])
async function handleGetHouseCVHistory() {
  const params = {
    houseID: houseId,
  }

  try {
    await houseStore.fetchHouseCVHistory(params)

    const dataFromBackend = houseStore.houseCVHistory

    labels.value = dataFromBackend.map(item => `${item.year}-${item.month}`)
    chartData.value = dataFromBackend.map(item => Number(item.cv.toFixed(3)))
  }
  catch (err) {
    console.error(err)
  }
}

const initialize = async () => {
  await handleGetHouseSummary()
  await handleGetHouseWeekly()
  await handleGetHouseCVHistory()
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
          <p class="text-body-1 mb-0">
            <span class="d-inline-block font-weight-medium text-high-emphasis">ชื่อฟาร์ม</span> {{
              houseStore.houseSummary.farm_name ? houseStore.houseSummary.farm_name : '-' }}
          </p>
          <p class="text-body-1 mb-0">
            <span class="d-inline-block font-weight-medium text-high-emphasis">ชื่อโรงเรือน</span> {{
              houseStore.houseSummary.house_name ? houseStore.houseSummary.house_name : '-' }}
          </p>
          <p class="text-body-1 mb-0">
            <span class="d-inline-block font-weight-medium text-high-emphasis">ข้อมูลสายพันธ์</span> {{
              houseStore.houseSummary.breed ? houseStore.houseSummary.breed : '-' }}
          </p>
          <p class="text-body-1 mb-0">
            <span class="d-inline-block font-weight-medium text-high-emphasis">เพศ</span> {{ houseStore.houseSummary.sex
              ? houseStore.houseSummary.sex : '-' }}
          </p>
        </template>

        <template #append>
          <MoreBtn :menu-list="moreList" />
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
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                <div v-if="houseStore.houseSummary.machines.length">
                  <div v-for="machine in houseStore.houseSummary.machines" :key="machine.mac">
                    <div class="text-blue-600 text-md">
                      {{ machine.mac }} {{ machine.sn }}
                    </div>
                  </div>
                </div>
              </h4>
              <!--
                <div class="text-body-1 mb-2">
                78% of target <span class="text-high-emphasis">🚀</span>
                </div>
                <VBtn size="small">
                View Sales
                </VBtn>
              -->
            </VCardText>

            <!-- Trophy -->
            <VImg :src="trophy" class="trophy" />
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  สูตรอาหาร
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.houseSummary.food ? houseStore.houseSummary.food : '-' }}
              </h4>
              <!--
                <div class="text-body-1 mb-2">
                78% of target <span class="text-high-emphasis">🚀</span>
                </div>
                <VBtn size="small">
                View Sales
                </VBtn>
              -->
            </VCardText>

            <!-- Trophy -->
            <VImg :src="trophy" class="trophy" />
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  วันที่เริ่มต้น
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.houseSummary.start_date ? houseStore.houseSummary.start_date.split("T")[0] : '-' }}
              </h4>
              <!--
                <div class="text-body-1 mb-2">
                78% of target <span class="text-high-emphasis">🚀</span>
                </div>
                <VBtn size="small">
                View Sales
                </VBtn>
              -->
            </VCardText>

            <!-- Trophy -->
            <VImg :src="trophy" class="trophy" />
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  วันที่คาดว่าจะสิ้นสุด
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.houseSummary.end_date ? houseStore.houseSummary.end_date.split("T")[0] : '-' }}
              </h4>
              <!--
                <div class="text-body-1 mb-2">
                78% of target <span class="text-high-emphasis">🚀</span>
                </div>
                <VBtn size="small">
                View Sales
                </VBtn>
              -->
            </VCardText>

            <!-- Trophy -->
            <VImg :src="trophy" class="trophy" />
          </VCard>
        </VCol>

        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  วันที่สิ้นสุดจริง
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.houseSummary.end_date ? houseStore.houseSummary.end_date.split("T")[0] : '-' }}
              </h4>
              <!--
                <div class="text-body-1 mb-2">
                78% of target <span class="text-high-emphasis">🚀</span>
                </div>
                <VBtn size="small">
                View Sales
                </VBtn>
              -->
            </VCardText>

            <!-- Trophy -->
            <VImg :src="trophy" class="trophy" />
          </VCard>
        </VCol>
        <VCol cols="12" md="2">
          <VCard class="position-relative">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  สถานะการทำงาน
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ houseStore.houseSummary.status ? houseStore.houseSummary.status : '-' }}
              </h4>
              <!--
                <div class="text-body-1 mb-2">
                78% of target <span class="text-high-emphasis">🚀</span>
                </div>
              -->
              <!--
                <VBtn size="small">
                View Sales
                </VBtn>
              -->
            </VCardText>

            <!-- Trophy -->
            <VImg :src="trophy" class="trophy" />
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <div class="d-flex justify-end align-center mb-6">
          <!-- Create Farm Button -->
          <VBtn color="primary" class="text-white me-2" @click="goToAddHouseDetail(course)">
            เพิ่มรายละเอียด
          </VBtn>

          <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="dialog = true">
            สิ้นสุดการเลี้ยง
          </VBtn>
        </div>

        <!-- Course Cards -->
        <VRow class="g-6">
          <VCol v-for="(course, i) in paginatedCourses" :key="i" cols="12" sm="6" md="6">
            <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">
              <!-- <VImg :src="course.image" height="180" cover class="rounded mb-4" /> -->

              <VCardTitle class="text-h6 mb-1">
                {{ course.title }}
              </VCardTitle>
              <VCardSubtitle class="mb-3">
                {{ course.category }}
              </VCardSubtitle>

              <VCardText class="text-body-2 text-truncate mb-5">
                {{ course.description }}
              </VCardText>

              <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
                {{ course.status }}
              </VChip>

              <!--
                <VCardActions class="justify-space-between pt-0">
                <VBtn color="primary" variant="flat" size="small">
                View
                </VBtn>
                <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
                {{ course.status }}
                </VChip>
                </VCardActions>
              -->
            </VCard>
          </VCol>
        </VRow>

        <!-- No result -->
        <div v-if="paginatedCourses.length === 0" class="text-center py-10 text-medium-emphasis">
          No courses found.
        </div>

        <!-- Pagination -->
        <!--
          <div class="mt-6 flex justify-center">
          <VPagination v-model="page" :length="pageCount" total-visible="5"
          @update:model-value="onPageChange" />
          </div>
        -->
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
      <!--
        <VueApexCharts
        :options="chartOptions"
        :series="series"
        :height="80"
        class="my-1"
        />
      -->
      <!-- <AnalyticsBarCharts /> -->
      <Test />
      <!-- <ShipmentStatisticsCard /> -->
    </VCol>
    <VCol cols="12" md="3">
      <AnalyticsSalesByCountries />
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
