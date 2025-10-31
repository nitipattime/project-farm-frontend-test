<script setup lang="ts">
import { ref, computed, shallowRef, watch } from 'vue'

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
  if (selectedFilter.value === 'All Courses') return courses.value
  return courses.value.filter(course => course.status === selectedFilter.value)
})

// ข้อมูลฟอร์ม
const farmForm = ref({
  name: '',
  contact: '',
  postcode: '',
  province: '',
  district: '',
  subdistrict: ''
})

// rules
const requiredRule = value => !!value || 'กรุณากรอกข้อมูล'
const postcodeRule = value => /^\d{5}$/.test(value) || 'รหัสไปรษณีย์ต้องมี 5 หลัก'

// ข้อมูล dropdown
const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ชลบุรี']  // ตัวอย่าง
const districts = {
  'กรุงเทพมหานคร': ['เขตพระนคร', 'เขตดุสิต'],
  'เชียงใหม่': ['อำเภอเมืองเชียงใหม่', 'อำเภอสันกำแพง'],
  'ชลบุรี': ['อำเภอเมืองชลบุรี', 'อำเภอบางละมุง']
}
const subdistricts = {
  'เขตพระนคร': ['พระบรมมหาราชวัง', 'วังบูรพา'],
  'เขตดุสิต': ['ดุสิต', 'วชิรพยาบาล']
}

// watch province/district เพื่อ update dropdown
const selectedDistricts = ref([])
const selectedSubdistricts = ref([])

watch(() => farmForm.value.province, (newVal) => {
  selectedDistricts.value = districts[newVal] || []
  farmForm.value.district = ''
  selectedSubdistricts.value = []
  farmForm.value.subdistrict = ''
})

watch(() => farmForm.value.district, (newVal) => {
  selectedSubdistricts.value = subdistricts[newVal] || []
  farmForm.value.subdistrict = ''
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <VRow>
          <!-- Column 1: รูป -->
          <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
            <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
            <VCardTitle>3</VCardTitle>
            <VCardTitle>โรงเรือน</VCardTitle>
          </VCol>

          <!-- <VDivider :vertical="$vuetify.display.mdAndUp" /> -->
          <VDivider vertical />

          <!-- Column 2: ชื่อสินค้า -->
          <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
            <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
            <VCardTitle>3</VCardTitle>
            <VCardTitle>โรงเรือน</VCardTitle>
          </VCol>

          <!-- <VDivider :vertical="$vuetify.display.mdAndUp" /> -->
          <VDivider vertical />

          <!-- Column 3: ราคา + ปุ่ม -->
          <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
            <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
            <VCardTitle>3</VCardTitle>
            <VCardTitle>โรงเรือน</VCardTitle>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <!-- Title -->
        <!-- <VCardTitle class="text-h5 font-weight-bold mb-2">
          My Courses
        </VCardTitle>
        <VCardSubtitle class="mb-6">
          Here’s a list of your enrolled courses
        </VCardSubtitle> -->

        <!-- Search Field -->
        <!-- <div class="d-flex justify-space-between align-center mb-6">
          <VTextField v-model="searchQuery" placeholder="Search courses" persistent-placeholder :loading="loading"
            append-inner-icon="mdi-magnify" @click:append-inner="onSearch" clearable hide-details variant="outlined"
            density="comfortable" style="max-width: 300px" />
        </div> -->
        <div class="d-flex justify-space-between align-center mb-6">
          <!-- Search Field -->
          <VTextField v-model="searchQuery" placeholder="ค้นหา" persistent-placeholder :loading="loading"
            append-inner-icon="mdi-magnify" @click:append-inner="onSearch" clearable hide-details variant="outlined"
            density="comfortable" style="max-width: 300px" />

          <!-- Create Farm Button -->
          <VBtn color="primary" class="text-white" @click="dialog = true" v-bind="activatorProps">
            สร้างฟาร์ม
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
                <VBtn color="primary" variant="flat" size="small">
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
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6 text-md-h5 text-lg-h4 mt-2">ข้อมูลฟาร์ม</v-card-title>
        <v-card-text>กรอกข้อมูลฟาร์มให้ครบถ้วน</v-card-text>

        <v-divider></v-divider>

        <v-card-text class="mt-6">
          <v-row dense>
            <v-col cols="12" md="12" sm="6">
              <v-text-field label="ชื่อ" v-model="farmForm.name" :rules="[requiredRule]" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12" sm="6">
              <v-text-field label="ชื่อผู้ติดต่อ" v-model="farmForm.contact" :rules="[requiredRule]"
                required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6" sm="6">
              <v-text-field label="รหัสไปรษณีย์" v-model="farmForm.postcode" :rules="[requiredRule, postcodeRule]"
                required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="จังหวัด" v-model="farmForm.province" :items="provinces" :rules="[requiredRule]"
                placeholder="เลือกจังหวัด" required></v-select>
            </v-col>
            <!-- <v-col cols="12" md="6" sm="6">
              <v-text-field label="จังหวัด" v-model="farmForm.province" :rules="[requiredRule]" required></v-text-field>
            </v-col> -->
          </v-row>
        </v-card-text>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-select label="อำเภอ/เขต" v-model="farmForm.district" :items="selectedDistricts" :rules="[requiredRule]"
                required></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select label="ตำบล/แขวง" v-model="farmForm.subdistrict" :items="selectedSubdistricts"
                :rules="[requiredRule]" required></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="mt-3">* กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนทำการบันทึก</v-card-text>

        <v-card-actions class="my-1 justify-center">
          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
          <v-btn color="primary" text="Save" variant="tonal" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <VRow dense>
    <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <VCard>
        ...
      </VCard>
    </VCol>

    <VDivider :vertical="$vuetify.display.mdAndUp" />

    <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <VCard>
        ...
      </VCard>
    </VCol>

    <VDivider :vertical="$vuetify.display.mdAndUp" />

    <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <VCard>
        ...
      </VCard>
    </VCol>
  </VRow>

  <VRow no-gutters>
    <!-- Column 1 -->
    <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
      <VCardTitle>3</VCardTitle>
      <VCardTitle>โรงเรือน</VCardTitle>
    </VCol>

    <!-- Divider -->
    <VCol cols="auto" class="d-none d-md-flex justify-center">
      <VDivider vertical />
    </VCol>

    <!-- Column 2 -->
    <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
      <VCardTitle>3</VCardTitle>
      <VCardTitle>โรงเรือน</VCardTitle>
    </VCol>

    <!-- Divider -->
    <VCol cols="auto" class="d-none d-md-flex justify-center">
      <VDivider vertical />
    </VCol>

    <!-- Column 3 -->
    <VCol cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <VCardTitle>จำนวนโรงเรือนทั้งหมด</VCardTitle>
      <VCardTitle>3</VCardTitle>
      <VCardTitle>โรงเรือน</VCardTitle>
    </VCol>
  </VRow>



  <VRow>
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

  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle class="text-h5 font-weight-bold mb-2">
          My Courses
        </VCardTitle>
        <VCardSubtitle class="mb-6">
          Here’s a list of your enrolled courses
        </VCardSubtitle>

        <!-- Dropdown Filter -->
        <div class="d-flex justify-space-between align-center mb-4">
          <VSelect v-model="selectedFilter" :items="filters" density="compact" hide-details variant="outlined"
            style="max-width: 180px" />
        </div>

        <!-- Courses Grid -->
        <VRow>
          <VCol v-for="(course, i) in filteredCourses" :key="i" cols="12" sm="6" md="4">
            <VCard elevation="1" class="h-100">
              <VImg :src="course.image" height="160" cover />

              <VCardItem>
                <VCardTitle>{{ course.title }}</VCardTitle>
                <VCardSubtitle>{{ course.category }}</VCardSubtitle>
              </VCardItem>

              <VCardText>
                <div class="text-body-2 text-truncate">{{ course.description }}</div>
              </VCardText>

              <VCardActions class="justify-space-between">
                <VBtn color="primary" variant="flat" size="small">View</VBtn>
                <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
                  {{ course.status }}
                </VChip>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <!-- Title -->
        <VCardTitle class="text-h5 font-weight-bold mb-2">
          My Courses
        </VCardTitle>
        <VCardSubtitle class="mb-6">
          Here’s a list of your enrolled courses
        </VCardSubtitle>

        <!-- Filter Dropdown -->
        <div class="d-flex justify-space-between align-center mb-6">
          <VSelect v-model="selectedFilter" :items="filters" density="comfortable" hide-details variant="outlined"
            style="max-width: 200px" />
        </div>

        <!-- Course Cards -->
        <VRow class="g-6"> <!-- g-6 = ช่องว่างระหว่างคอลัมน์ -->
          <VCol v-for="(course, i) in filteredCourses" :key="i" cols="12" sm="6" md="4">
            <VCard elevation="2" class="pa-4 h-100">
              <VImg :src="course.image" height="180" cover class="rounded mb-4" />

              <VCardTitle class="text-h6 mb-1">{{ course.title }}</VCardTitle>
              <VCardSubtitle class="mb-3">{{ course.category }}</VCardSubtitle>

              <VCardText class="text-body-2 text-truncate mb-5">
                {{ course.description }}
              </VCardText>

              <VCardActions class="justify-space-between pt-0">
                <VBtn color="primary" variant="flat" size="small">
                  View
                </VBtn>
                <VChip :color="course.status === 'Completed' ? 'success' : 'info'" size="small" label>
                  {{ course.status }}
                </VChip>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <VCard class="pa-6">
        <!-- Title -->
        <VCardTitle class="text-h5 font-weight-bold mb-2">
          My Courses
        </VCardTitle>
        <VCardSubtitle class="mb-6">
          Here’s a list of your enrolled courses
        </VCardSubtitle>

        <!-- Search Field -->
        <div class="d-flex justify-space-between align-center mb-6">
          <VTextField id="firstName" placeholder="John" persistent-placeholder :loading="loading"
            append-inner-icon="mdi-magnify" @click:append-inner="onClick" />
        </div>

        <!-- Course Cards -->
        <VRow class="g-6">
          <VCol v-for="(course, i) in filteredCourses" :key="i" cols="12" sm="6" md="4">
            <VCard elevation="2" class="pa-4 h-100">
              <VImg :src="course.image" height="180" cover class="rounded mb-4" />

              <VCardTitle class="text-h6 mb-1">{{ course.title }}</VCardTitle>
              <VCardSubtitle class="mb-3">{{ course.category }}</VCardSubtitle>


              <VCardText class="text-body-2 text-truncate mb-5">
                {{ course.description }}
              </VCardText>

              <VCardActions class="justify-space-between pt-0">
                <VBtn color="primary" variant="flat" size="small">
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
        <div v-if="filteredCourses.length === 0" class="text-center py-10 text-medium-emphasis">
          No courses found.
        </div>
        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
          <VPagination v-model="page" :length="pageCount" total-visible="5" @update:model-value="onPageChange" />
        </div>
      </VCard>
    </VCol>
  </VRow>

  <div class="pa-6">
    <!-- Search field -->
    <VTextField v-model="searchQuery" placeholder="Search courses" persistent-placeholder
      append-inner-icon="mdi-magnify" @click:append-inner="fetchCourses" clearable hide-details variant="outlined"
      density="comfortable" style="max-width: 300px" />

    <!-- Content list -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <VCard v-for="item in paginatedCourses" :key="item.id">
        <VCardTitle>{{ item.title }}</VCardTitle>
        <VCardSubtitle>{{ item.category }}</VCardSubtitle>
      </VCard>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center">
      <VPagination v-model="page" :length="pageCount" total-visible="5" @update:model-value="onPageChange" />
    </div>
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
