<script setup lang="ts">
import { useRouter } from 'vue-router'

import { computed, onMounted, ref, shallowRef, watch } from 'vue'

import { useNumberFormat } from '@/composables/useNumberFormat'
import { deleteFarm } from '@/services/farmService'
import { useFarmStore } from '@/stores/farmStore'
import imgChicken from '@images/pages/Chicken.png'
import imgFarm from '@images/pages/Farm.png'
import imgHouse from '@images/pages/House.png'

const { formatNumber } = useNumberFormat()

const router = useRouter()
const farmStore = useFarmStore()
const dialog = shallowRef(false)
const loading = ref(false)

const selectedFilter = ref('All Courses')

const searchQuery = ref('')
const page = ref(1)

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

const pageCount = computed(() => Math.ceil(farmStore.pagination.total / farmStore.pagination.limit))

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
  zip_code: '',
  province_id: null,
  district_id: null,
  subdistrict_id: null,
})

const formRef = ref(null)

const requiredRule = (v: any) => !!v || 'กรุณากรอกข้อมูล'
// const postcodeRule = (v: any) =>
//     (v && v.length === 5) || 'รหัสไปรษณีย์ต้องเป็น 5 หลัก'

const postcodeRule = (v: any) => {
  return (v && String(v).length == 5) || 'รหัสไปรษณีย์ต้องเป็น 5 หลัก'
}
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
    // page: farmStore.pagination.page,
    page: page.value,
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
}

onMounted(async () => {
  await initialize()
})

const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')
const deleteDialog = ref(false)
const deletePassword = ref('')
const selectedFarmId = ref(null)

function onSelectedMenu(farm: any, action: string) {
  console.log(action)

  if (action === 'delete-farm') {
    selectedFarmId.value = farm.id // เก็บ id ฟาร์มที่จะลบ
    deleteDialog.value = true // เปิด dialog
  }
}

async function onDeleteDialog() {
  // if (!deletePassword.value) {
  //   alert('กรุณากรอกรหัสผ่าน')

  //   return
  // }

  try {
    await deleteFarm({
      farm_id: selectedFarmId.value,
      password: deletePassword.value,
    })

    deletePassword.value = ''
    deleteDialog.value = false

    // reload farm list
    showAlert('success', 'ลบข้อมูลฟาร์มเรียบร้อยแล้ว')
    initialize()
  }
  catch (err) {
    console.error(err)
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
  const { valid } = await formRef.value.validate()
  if (!valid) {
    // showAlert('error', 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง')
    return
  }

  try {
    const payload = {
      farm_name: farmForm.value.name,
      contact_name: farmForm.value.contact,
      province: farmForm.value.province_id,
      district: farmForm.value.district_id,
      subdistrict: farmForm.value.subdistrict_id,

      // zip_code: farmForm.value.zip_code,
    }

    console.log(payload)

    await farmStore.addFarm(payload)

    dialog.value = false
    resetForm()

    showAlert('success', 'บันทึกข้อมูลฟาร์มเรียบร้อยแล้ว')
    await initialize()
  }
  catch (error) {
    console.error(error)
    showAlert('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่')
  }
}

// const showSnackbar = () => {
//   showAlert.value = true
//   alertType.value = 'success'
//   alertMessage.value = 'บันทึกข้อมูลฟาร์มเรียบร้อยแล้ว'
// }

const moreList = [
  { title: 'ลบ', value: 'delete-farm' },
]
</script>

<template>
  <VOverlay v-model="alert.show" class="d-flex align-center justify-center" scrim>
    <VAlert :type="alert.type" border="start" elevation="2" class="mb-4">
      <strong>{{ alert.message }}</strong>
    </VAlert>
  </VOverlay>
  <VRow>
    <VCol cols="12">
      <VRow class="g-6">
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
                {{ formatNumber(farmStore.summary.totalFarms) }}
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
            <VImg :src="imgFarm" class="trophy" />
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
                {{ formatNumber(farmStore.summary.totalHouses) }}
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
                {{ formatNumber(farmStore.summary.totalChicken) }}
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
        ฺ
        <VRow class="g-6">
          <VCol v-for="(farm, i) in farmStore.farmlist" :key="i" cols="12" sm="6" md="4">
            <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">
              <template #subtitle>
                <VCardTitle class="text-h5">
                  ชื่อฟาร์ม : {{ farm.farm_name }}
                </VCardTitle>
              </template>
              <VCardTitle class="text-h6 px-5">
                จำนวนโรงเรือน : {{ farm.house_count }}
              </VCardTitle>

              <VCardTitle class="text-h6 px-5">
                จังหวัด : {{ farm.province }}
              </VCardTitle>

              <VCardTitle class="text-h6 px-5">
                ชื่อผู้ดูแล : {{ farm.contact_name }}
              </VCardTitle>

              <VCardActions class="justify-space-between pt-3">
                <VBtn color="primary" variant="flat" size="small" @click="goToFarmDetail(farm)">
                  View
                </VBtn>
              </VCardActions>
              <template #append>
                <!-- <MoreBtn :menu-list="moreList" /> -->
                <MoreBtn :menu-list="moreList" @selected="(value) => onSelectedMenu(farm, value)" />
              </template>
            </VCard>
          </VCol>
        </VRow>

        <!--
          <VRow class="g-6">
          <VCol v-for="(farm, i) in farmStore.farmlist" :key="i" cols="12" sm="6" md="4">
          <VCard elevation="2" class="pa-4 h-100 border border-solid border-gray-800">
          <div class="flex items-start justify-between flex-nowrap w-full">
          <VCardTitle class="text-h6 m-0 p-0 whitespace-nowrap">
          ชื่อฟาร์ม : {{ farm.farm_name }}
          </VCardTitle>
          <div class="shrink-0">
          <MoreBtn :menu-list="moreList" />
          </div>
          </div>
          <VCardTitle class="text-h6">
          จำนวนโรงเรือน : {{ farm.house_count }}
          </VCardTitle>
          <VCardTitle class="text-h6">
          จังหวัด : {{ farm.province }}
          </VCardTitle>
          <VCardTitle class="text-h6">
          ชื่อผู้ดูแล : {{ farm.contact_name }}
          </VCardTitle>
          <VCardActions class="justify-space-between pt-0">
          <VBtn color="primary" variant="flat" size="small" @click="goToFarmDetail(farm)">
          View
          </VBtn>
          </VCardActions>
          </VCard>
          </VCol>
          </VRow>
        -->

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

  <VDialog v-model="dialog" max-width="600">
    <VCard>
      <VCardTitle class="text-h6 text-md-h5 text-lg-h4 mt-2">
        ข้อมูลฟาร์ม
      </VCardTitle>
      <VCardText>กรอกข้อมูลฟาร์มให้ครบถ้วน</VCardText>

      <VDivider />

      <!-- Form start -->
      <VForm ref="formRef">
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
              <VTextField v-model="farmForm.zip_code" label="รหัสไปรษณีย์" counter="5"
                :rules="[postcodeRule, requiredRule]" required @blur="fetchAddressByZip(farmForm.zip_code)" />
            </VCol>

            <VCol cols="12" md="6">
              <VSelect v-model="farmForm.province_id" item-title="label" item-value="value" label="จังหวัด"
                :items="provinces" :rules="[requiredRule]" placeholder="เลือกจังหวัด" required
                @update:model-value="onProvinceChange" />
            </VCol>
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
      </VForm>
      <!-- Form end -->

      <VDivider />
      <VCardActions class="my-1 justify-center">
        <VBtn text="Close" variant="plain" @click="closeDialog" />
        <VBtn color="primary" text="Save" variant="tonal" @click="submitForm" />
      </VCardActions>
    </VCard>
  </VDialog>



  <VDialog v-model="deleteDialog" max-width="400">
    <VCard>
      <VCardTitle class="text-h6">
        ยืนยันการลบโรงเรือน
      </VCardTitle>

      <VCardText>
        <div class="mb-4">
          คุณต้องการลบโรงเรือนใช่หรือไม่?<br>
          กรุณากรอกรหัสผ่านเพื่อยืนยัน
        </div>

        <!-- ช่องกรอกรหัสผ่าน -->
        <VTextField v-model="deletePassword" label="รหัสผ่าน" type="password" variant="outlined"
          density="comfortable" />
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" @click="deleteDialog = false">
          ยกเลิก
        </VBtn>
        <VBtn color="primary" @click="onDeleteDialog">
          ยืนยันการลบ
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

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

.v-card .trophy {
  position: absolute;
  inline-size: 5.188rem;
  inset-block-end: 1.25rem;
  inset-inline-end: 1.25rem;
}
</style>
