<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useHouseStore } from '@/stores/houseStore';

const props = defineProps<{ id: string }>()
const farmId = Number.parseInt(props.id || '0', 10)
const router = useRouter()
const dialog = shallowRef(false)
const loaded = ref(false)
const loading = ref(false)
const houseStore = useHouseStore()

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
    // offset: offset.value,
    // limit: limit.value,
    // search: textSearch.value,

    // sort_by: sortBy.value,
    // sort_dir: sortDirection.value,
    // page: tablePage.value,
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
  { id: 3, title: 'Docker for Developers', category: 'DevOps' },
  { id: 4, title: 'Advanced Vuetify', category: 'Frontend' },
  { id: 5, title: 'REST & gRPC APIs', category: 'Backend' },
  { id: 6, title: 'SQL Performance Tuning', category: 'Database' },
  { id: 7, title: 'CI/CD with GitLab', category: 'DevOps' },
  { id: 8, title: 'Tailwind UI Design', category: 'Frontend' },
  { id: 9, title: 'Intro to Physics', category: 'Science' },
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
  postcode: '',
  province: '',
  district: '',
  subdistrict: '',
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

// submitForm
function submitForm() {
  // ตรวจสอบว่าทุก field ผ่าน validation หรือไม่
  // Vuetify v3 จะ validate อัตโนมัติเมื่อกดปุ่ม Save
  console.log(farmForm.value)
  dialog.value = false
}

// go to house deatil
function goToHouseDetail(items: any) {
  console.log(items)

  // router.push('/farmDetail') // หรือใช้ชื่อ route: router.push({ name: 'about' })
  router.push({ name: 'house-detail', params: { id: items.id } }) // หรือใช้ชื่อ route: router.push({ name: 'about' })
}
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
            <VImg :src="trophy" class="trophy" />
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
            <VImg :src="trophy" class="trophy" />
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
            <VImg :src="trophy" class="trophy" />
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
            style="max-width: 300px" @click:append-inner="onSearch" />

          <!-- Create Farm Button -->
          <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="dialog = true">
            เพิ่มโรงเรือน
          </VBtn>
        </div>

        <!-- Course Cards -->
        <VRow class="g-6">
          <VCol v-for="(course, i) in paginatedCourses" :key="i" cols="12" sm="6" md="4">
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

              <VCardActions class="justify-space-between pt-0">
                <VBtn color="primary" variant="flat" size="small" @click="goToHouseDetail(course)">
                  View
                </VBtn>
                <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
                  {{ course.status }}
                </VChip>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>

        <!-- No result -->
        <div v-if="paginatedCourses.length === 0" class="text-center py-10 text-medium-emphasis">
          No courses found.
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
          <VPagination v-model="page" :length="pageCount" total-visible="5" @update:model-value="onPageChange" />
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
