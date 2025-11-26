<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as XLSX from 'xlsx'

import { importFile } from '@/services/fileService'
import { useHouseStore } from '@/stores/houseStore'

const file = ref<File | null>(null)
const tableData = ref<any[]>([])
const breedId = ref('')
const houseStore = useHouseStore()

// const selectedItem = ref('')
const selectedItem = ref<number | string | null>(null)
const breedOptions = ref<{ title: string; value: number }[]>([])

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

function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement
    if (!target.files?.length)
        return

    file.value = target.files[0]

    const reader = new FileReader()

    reader.onload = (evt: any) => {
        const data = evt.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        tableData.value = XLSX.utils.sheet_to_json(sheet)
    }

    reader.readAsBinaryString(file.value)
}

async function submitData() {
    try {
        if (!selectedItem.value || tableData.value.length === 0) {
            showAlert('warning', 'Please select breed and import file first.')

            return
        }

        let breedValue: string | number

        const selected = selectedItem.value

        // ✅ กรณีเป็น object (Proxy/Object)
        if (typeof selected === 'object' && selected !== null && 'value' in selected)
            breedValue = (selected as any).value

        // ✅ กรณีเป็น string / number
        else
            breedValue = selected as string | number

        // console.log('Breed Value:', breedValue)
        // console.log('Imported Rows:', tableData.value)

        const formData = new FormData()

        formData.append('breed', String(breedValue)) // ส่ง breed
        formData.append('file', file.value)

        // console.log('File:', file.value)

        await importFile(formData)
        showAlert('success', 'Upload สำเร็จ')
    }
    catch (e) {
        console.error(e)
        showAlert('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
}

async function handleGetChickenBreed() {
    try {
        const res = await houseStore.fetchChickenBreed()

        breedOptions.value = res.data.map((item: string, index: number) => ({
            title: item, // ใช้ตัว string เป็น title
            value: item, // value เป็น string ก็ได้ (ถ้า DB ต้องการ index ก็ใช้ index)
            // value: index      // ถ้าต้องการให้ value เป็นตัวเลข
        }))

        if (breedOptions.value.length > 0) {
            selectedItem.value = breedOptions.value[0].value // เซ็ตค่า default
            breedId.value = breedOptions.value[0].value
        }
    }
    catch (err) {
        console.error(err)
    }
}

const initialize = async () => {
    await handleGetChickenBreed()
}

onMounted(async () => {
    await initialize()

    // console.log(`houseID: ${props.id}`)
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
            <VCard class="pa-6">
                <!-- Card Title -->
                <h2 class="text-h6 font-weight-bold mb-6">
                    เพิ่มรายละเอียดการเพาะเลี้ยง
                </h2>

                <div class="space-y-8">
                    <!-- Section Title -->
                    <div>
                        <h3 class="text-subtitle-1 font-weight-semibold mb-1">
                            Import Weight Target Data
                        </h3>
                        <p class="text-body-2 text-medium-emphasis">
                            อัปโหลดข้อมูลน้ำหนักเป้าหมาย (Excel)
                        </p>
                    </div>

                    <!-- Select Breed -->
                    <div class="space-y-2">
                        <label class="text-subtitle-2 font-weight-medium">
                            Select Breed
                        </label>

                        <!--
              <VCombobox v-model="selectedItem" :items="breedOptions" placeholder="Select breed"
              variant="outlined" density="comfortable" />
            -->
                        <VCombobox v-model="selectedItem" :items="breedOptions" item-title="title" item-value="value"
                            placeholder="Select breed" variant="outlined" density="comfortable" />
                    </div>

                    <!-- Upload Excel -->
                    <div class="space-y-2">
                        <label class="text-subtitle-2 font-weight-medium">
                            Upload Excel File
                        </label>

                        <VFileInput label="Choose .xls or .xlsx file" accept=".xlsx,.xls" variant="outlined"
                            density="comfortable" @change="handleFileUpload" />
                    </div>

                    <!-- Submit -->
                    <div class="pt-4">
                        <VBtn color="primary" class="text-white" size="large" @click="submitData">
                            Submit
                        </VBtn>
                    </div>
                </div>
            </VCard>
        </VCol>
    </VRow>

    <VRow>
        <VCol>
            <VCard>
                <div v-if="tableData.length" class="mt-6">
                    <h3 class="text-lg font-semibold mb-2">
                        Preview Data
                    </h3>

                    <table class="min-w-full border text-sm">
                        <thead>
                            <tr>
                                <th v-for="(v, key) in tableData[0]" :key="key" class="border px-2 py-1 bg-gray-100">
                                    {{ key }}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(row, i) in tableData" :key="i">
                                <td v-for="(v, key) in row" :key="key" class="border px-2 py-1">
                                    {{ v }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </VCard>
        </VCol>
    </VRow>
</template>
