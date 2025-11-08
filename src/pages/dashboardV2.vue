<script setup lang="ts">
import { useRouter } from 'vue-router'

import { computed, onMounted, ref, shallowRef, watch } from 'vue'

import { useFarmStore } from '@/stores/farmStore'

const router = useRouter()
const farmStore = useFarmStore()
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
  { id: 3, title: 'Docker for Developers', category: 'DevOps' },
  { id: 4, title: 'Advanced Vuetify', category: 'Frontend' },
  { id: 5, title: 'REST & gRPC APIs', category: 'Backend' },
  { id: 6, title: 'SQL Performance Tuning', category: 'Database' },
  { id: 7, title: 'CI/CD with GitLab', category: 'DevOps' },
  { id: 8, title: 'Tailwind UI Design', category: 'Frontend' },
  { id: 9, title: 'Intro to Physics', category: 'Science' },
])

const pageCount = computed(() => Math.ceil(farmStore.pagination.page / perPage))

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
  province_id: null,
  district_id: null,
  subdistrict_id: null,
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
// function submitForm() {
//   // ตรวจสอบว่าทุก field ผ่าน validation หรือไม่
//   // Vuetify v3 จะ validate อัตโนมัติเมื่อกดปุ่ม Save
//   console.log(farmForm.value)
//   dialog.value = false
// }

// go to farm deatil
function goToFarmDetail(items: any) {
  console.log(items)

  // router.push('/farmDetail') // หรือใช้ชื่อ route: router.push({ name: 'about' })
  router.push({ name: 'farm-detail', params: { id: items.id } }) // หรือใช้ชื่อ route: router.push({ name: 'about' })
}

async function handleGetCampaignList() {
  const params = {
    // offset: offset.value,
    // limit: limit.value,
    search: searchQuery.value,

    // sort_by: sortBy.value,
    // sort_dir: sortDirection.value,
    page: farmStore.pagination.page,
  }

  try {
    await farmStore.fetchFarms(params)

    // totalPages.value = farmStore.pagination.totalPages
  }
  catch (err) {
    const error = err as any

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

// form add farm
interface Province {
  value: number
  label: string
}

interface District {
  value: number
  label: string
}
interface Subdistrict {
  value: number
  label: string
  zip_code: string
}

// interface SubdistrictOption {
//   value: number
//   label: string

// }

const provinces = ref<Province[]>([])
const districts = ref<District[]>([])
const subdistricts = ref<Subdistrict[]>([])

const onProvinceChange = async (provinceId: number) => {
  console.log('เลือกจังหวัด:', provinceId)

  farmForm.value.province_id = provinceId
  farmForm.value.district_id = null
  farmForm.value.subdistrict_id = null
  farmForm.value.zip_code = ''

  const params = { provinceId }

  const res = await farmStore.fetchDistrict(params)

  districts.value = res
}

// const onProvinceChange = async (e: any) => {
//   // farmForm.value.province_id = e.id
//   // farmForm.value.district_id = 0
//   // farmForm.value.subdistrict_id = 0
//   // farmForm.value.zip_code = ''

//   const params = { provinceId: e.id }

//   console.log(e.id)
//   console.log(params)

//   const res = await farmStore.fetchDistrict(params)

//   districts.value = res

//   // console.log('@change="onDistrictChange"')

//   // const id = Number(e.target.value)

//   // farmForm.value.province_id = id
//   // farmForm.value.district_id = 0
//   // farmForm.value.subdistrict_id = 0
//   // farmForm.value.zip_code = ''

//   // const params = {
//   //   provinceId: id,
//   // }

//   // const res = await farmStore.fetchDistrict(params)

//   // districts.value = res
// }

const onDistrictChange = async (districtId: number) => {
  console.log('เลือกอำเภอ:', districtId)

  farmForm.value.district_id = districtId
  farmForm.value.subdistrict_id = null
  farmForm.value.zip_code = ''

  const params = { districtId }
  const res = await farmStore.fetchSubDistrict(params)

  subdistricts.value = res
}

// const onDistrictChange = async (e: any) => {
//   const id = Number(e.target.value)

//   farmForm.value.district_id = id
//   farmForm.value.subdistrict_id = 0
//   farmForm.value.zip_code = ''

//   const params = {
//     districtId: id,
//   }

//   const res = await farmStore.fetchSubDistrict(params)

//   subdistricts.value = res
//   console.log('subdistrict2222')
//   console.log(res)
// }

const onSubdistrictChange = (subdistrictId: number) => {
  console.log('เลือกตำบล:', subdistrictId)

  farmForm.value.subdistrict_id = subdistrictId

  const subdistrict = subdistricts.value.find(s => s.value === subdistrictId)

  farmForm.value.zip_code = subdistrict?.zip_code || ''
}

// const onSubdistrictChange = async (e: any) => {
//   const id = Number(e.target.value)

//   farmForm.value.subdistrict_id = id // ถ้าใน DB ต้องการ number

//   const subdistrict = subdistricts.value.find(s => s.value === id)

//   farmForm.value.zip_code = subdistrict?.zip_code || ''

//   // const id = Number(e.target.value)
//   // formV2.subdistrict_id = id

//   // const subdistrict = subdistricts.value.find((s) => s.value === id)

//   // formV2.zip_code = subdistrict?.zip_code || ''
// }

const fetchAddressByZip = async (zipCode: any) => {
  if (!zipCode || zipCode.length < 5) {
    // ถ้ากรอกไม่ครบ 5 หลัก แค่เคลียร์ district/subdistrict ก็พอ
    farmForm.value.district_id = null
    farmForm.value.subdistrict_id = null
    farmForm.value.zip_code = zipCode
    districts.value = []
    subdistricts.value = []

    return
  }

  try {
    const params = { zip: zipCode }
    const res = await farmStore.fetchAddress(params)

    if (!res || res.length === 0) {
      // ถ้าไม่เจอรหัสไปรษณีย์ เคลียร์เฉพาะ district/subdistrict
      districts.value = []
      subdistricts.value = []

      return
    }

    const location = res[0]

    // ตั้งค่า form
    farmForm.value.province_id = location.province_id
    farmForm.value.district_id = location.district_id
    farmForm.value.subdistrict_id = location.subdistrict_id
    farmForm.value.zip_code = zipCode

    // โหลดเฉพาะ district/subdistrict ตามจังหวัดนั้น
    const resDistricts = await farmStore.fetchDistrict({ provinceId: location.province_id })

    districts.value = resDistricts

    const resSubDistricts = await farmStore.fetchSubDistrict({ districtId: location.district_id })

    subdistricts.value = resSubDistricts
  }
  catch (error) {
    console.error('ไม่พบรหัสไปรษณีย์นี้:', error)

    // เคลียร์เฉพาะ district/subdistrict
    districts.value = []
    subdistricts.value = []
  }
}

// const fetchAddressByZip = async (zipCode: any) => {
//   // const id = String(zipCode)
//   const params = {
//     zip: zipCode,
//   }

//   const res = await farmStore.fetchAddress(params)

//   const location = res[0]

//   farmForm.value.province_id = location.province_id
//   farmForm.value.district_id = location.district_id
//   farmForm.value.subdistrict_id = location.subdistrict_id
//   farmForm.value.zip_code = zipCode

//   // โหลด districts
//   const resProvince = await farmStore.fetchProvince()

//   provinces.value = resProvince

//   // โหลด districts
//   const paramsDistricts = {
//     provinceId: location.province_id,
//   }

//   const resDistricts = await farmStore.fetchDistrict(paramsDistricts)

//   districts.value = resDistricts

//   // โหลด subdistricts
//   const paramsSubDistricts = {
//     districtId: location.district_id,
//   }

//   const resSubDistricts = await farmStore.fetchSubDistrict(paramsSubDistricts)

//   subdistricts.value = resSubDistricts
// }

function clearAddressFields() {
  farmForm.value.province_id = null
  farmForm.value.district_id = null
  farmForm.value.subdistrict_id = null
  farmForm.value.zip_code = ''
  districts.value = []
  subdistricts.value = []
}

function closeDialog() {
  dialog.value = false
  resetForm()
}

function resetForm() {
  farmForm.value = {
    name: '',
    contact: '',
    zip_code: '',

    // province_id: null,
    district_id: null,
    subdistrict_id: null,
  }

  // provinces.value = []
  districts.value = []
  subdistricts.value = []
}

// watch(dialog, (newVal: any) => {
//   if (newVal === true)
//     resetForm()
// })

watch(() => farmForm.value.zip_code, (newVal: any) => {
  if (newVal && newVal.length === 5)
    fetchAddressByZip(newVal)
})

watch(dialog, (val: any) => {
  if (!val) {
    // ถ้า dialog ปิด (เช่น คลิกข้างนอก)
    resetForm()
  }
})

const initialize = async () => {
  await handleGetCampaignList()

  const res = await farmStore.fetchProvince()

  provinces.value = res

  // const res =
  //

  // await handleGetAddress()
  // await farmStore.fetchProvince()
  // await farmStore.fetchDistrict()
  // await farmStore.fetchSubDistrict()
  // getDistricts
  // getSubDistricts
  // getAddress
  // getProvince
}

onMounted(async () => {
  await initialize()
})

const formRef = ref()
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')

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
      name: farmForm.value.name,
      contact: farmForm.value.contact,
      zip_code: farmForm.value.zip_code,
      province_id: farmForm.value.province_id,
      district_id: farmForm.value.district_id,
      subdistrict_id: farmForm.value.subdistrict_id,
    }

    console.log(payload)

    // await farmStore.createFarm(payload)

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

// const showSnackbar = () => {
//   showAlert.value = true
//   alertType.value = 'success'
//   alertMessage.value = 'บันทึกข้อมูลฟาร์มเรียบร้อยแล้ว'
// }
</script>

<template>
  <VSnackbar v-model="showAlert" :color="alertType" timeout="2000">
    {{ alertMessage }}
  </VSnackbar>
  <VRow>
    <VCol cols="12">
      <VRow>
        <VCol cols="12" md="4">
          <VCard class="position-relative" md="4">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  จำนวนฟาร์มทั้งหมด
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ farmStore.summary.totalFarms }}
              </h4>
              <div class="text-body-1 mb-2">
                ฟาร์ม
              </div>
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
        <VCol cols="12" md="4">
          <VCard class="position-relative" md="4">
            <VCardText>
              <div class="mb-2">
                <h5 class="text-h5">
                  จำนวนโรงเรือนทั้งหมด
                </h5>
                <!--
                  <div class="text-body-1">
                  Best seller of the month
                  </div>
                -->
              </div>
              <h4 class="text-h4 text-primary">
                {{ farmStore.summary.totalHouses }}
              </h4>
              <div class="text-body-1 mb-2">
                โรงเรือน
              </div>
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
                {{ farmStore.summary.totalChicken }}
              </h4>
              <div class="text-body-1 mb-2">
                ตัว
              </div>
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
          <!-- @click:append-inner="onSearch" -->

          <!-- Create Farm Button -->
          <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="dialog = true">
            เพิ่มฟาร์ม
          </VBtn>
        </div>

        <!-- Course Cards -->
        <!--
          <VRow class="g-6">
          <VCol v-for="(course, i) in paginatedCourses" :key="i" cols="12" sm="6" md="4">
          <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">

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
          <VBtn color="primary" variant="flat" size="small" @click="goToFarmDetail(course)">
          View
          </VBtn>
          <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
          {{ course.status }}
          </VChip>
          </VCardActions>
          </VCard>
          </VCol>
          </VRow>
        -->
        <VRow class="g-6">
          <VCol v-for="(farm, i) in farmStore.farmlist" :key="i" cols="12" sm="6" md="4">
            <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">
              <VCardTitle class="text-h6">
                ชื่อฟาร์ม : {{ farm.farm_name }}
              </VCardTitle>
              <VCardTitle class="text-h6">
                จำนวนโรงเรือน : {{ farm.house_count }}
              </VCardTitle>
              <VCardTitle class="text-h6">
                จังหวัด : {{ farm.province }}
              </VCardTitle>
              <VCardTitle class="text-h6">
                ชื่อผู้ดูแล : {{ farm.contact_name }}
              </VCardTitle>
              <!--
                <VCardSubtitle class="mb-3">
                จำนวนโรงเรือน : {{ farm.house_count }} โรงเรือน
                </VCardSubtitle>

                <VCardText class="text-body-2 text-truncate mb-5">
                จังหวัด : {{ farm.province }}
                </VCardText>

                <VCardText class="text-body-2 text-truncate mb-5">
                ชื่อผู้ดูแล : {{ farm.contact_name }}
                </VCardText>
              -->

              <VCardActions class="justify-space-between pt-0">
                <VBtn color="primary" variant="flat" size="small" @click="goToFarmDetail(farm)">
                  View
                </VBtn>
                <!--
                  <VChip :color="farm.status === 'Completed' ? 'success' : 'info'" size="small" label>
                  {{ farm.status }}
                  </VChip>
                -->
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>

        <!-- No result -->
        <div v-if="farmStore.pagination.totalPages === 0" class="text-center py-10 text-medium-emphasis">
          No courses found.
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
          <VPagination v-model="farmStore.pagination.page" :length="pageCount" total-visible="5"
            @update:model-value="onPageChange" />
        </div>
      </VCard>
    </VCol>
  </VRow>

  <div class="pa-4 text-center">
    <VDialog v-model="dialog" max-width="600" @after-leave="showSnackbar">
      <VCard>
        <VCardTitle class="text-h6 text-md-h5 text-lg-h4 mt-2">
          ข้อมูลฟาร์ม
        </VCardTitle>
        <VCardText>กรอกข้อมูลฟาร์มให้ครบถ้วน</VCardText>

        <VDivider />

        <VCardText class="mt-6">
          <VRow dense>
            <VCol cols="12" md="12" sm="6">
              <VTextField v-model="farmForm.name" label="ชื่อ" counter="20" :rules="[requiredRule]" required />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <VRow dense>
            <VCol cols="12" md="12" sm="6">
              <VTextField v-model="farmForm.contact" label="ชื่อผู้ติดต่อ" counter="20" :rules="[requiredRule]"
                required />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText>
          <VRow dense>
            <VCol cols="12" md="6" sm="6">
              <!--
                <VTextField v-model="farmForm.zip_code" label="รหัสไปรษณีย์" counter="5"
                :rules="[requiredRule, postcodeRule]" required @update:model-value="fetchAddressByZip" />
              -->
              <VTextField v-model="farmForm.zip_code" label="รหัสไปรษณีย์" counter="5"
                :rules="[requiredRule, postcodeRule]" required @blur="fetchAddressByZip(farmForm.zip_code)" />
            </VCol>
            <VCol cols="12" md="6">
              <!--
                <VSelect v-model="farmForm.province_id" item-title="label" item-value="value" label="จังหวัด"
                :items="provinces" :rules="[requiredRule]" placeholder="เลือกจังหวัด" required
                @update:model-value="onProvinceChange" />
              -->
              <VSelect v-model="farmForm.province_id" item-title="label" item-value="value" label="จังหวัด"
                :items="provinces" :rules="[requiredRule]" placeholder="เลือกจังหวัด" required
                @update:model-value="onProvinceChange" />
            </VCol>
            <!--  -->
            <!--
              <v-col cols="12" md="6" sm="6">
              <v-text-field label="จังหวัด" v-model="farmForm.province" :rules="[requiredRule]" required></v-text-field>
              </v-col>
            -->
          </VRow>
        </VCardText>

        <VCardText>
          <VRow dense>
            <VCol cols="12" md="6">
              <VSelect v-model="farmForm.district_id" item-title="label" item-value="value" label="อำเภอ/เขต"
                :items="districts" :rules="[requiredRule]" required @update:model-value="onDistrictChange" />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="farmForm.subdistrict_id" item-title="label" item-value="value" label="ตำบล/แขวง"
                :items="subdistricts" :rules="[requiredRule]" required @update:model-value="onSubdistrictChange" />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardText class="mt-3">
          * กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนทำการบันทึก
        </VCardText>

        <!--
          <VCardActions class="my-1 justify-center">
          <VBtn text="Close" variant="plain" @click="closeDialog" />
          <VBtn color="primary" text="Save" variant="tonal" @click="submitForm" />
          </VCardActions>
        -->
        <VCardActions class="my-1 justify-center">
          <VBtn text="Close" variant="plain" @click="closeDialog" />
          <VBtn color="primary" text="Save" variant="tonal" @click="submitForm" />
        </VCardActions>
      </VCard>
    </VDialog>
  </div>

  <!--
    <div v-if="showAlert">
    <VAlert :color="alertType" :text="alertMessage" variant="tonal" />
    </div>
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
</style>
