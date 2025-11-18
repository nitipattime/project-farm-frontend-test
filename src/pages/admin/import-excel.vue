<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const file = ref<File | null>(null)
const tableData = ref<any[]>([])
const breedId = ref('')

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

function submitData() {
    if (!breedId.value || tableData.value.length === 0) {
        alert('Please select breed and import file first.')

        return
    }

    // TODO: Replace with API call
    console.log('Breed:', breedId.value)
    console.log('Imported Rows:', tableData.value)
    alert('Data ready to submit!')
}
</script>

<template>
    <VRow>
        <VCol cols="12">
            <VCard title="เพิ่มรายละเอียดการเพาะเลี้ยง" class="pa-4">
                <div class="p-8 space-y-8">
                    <h2 class="text-2xl font-bold">
                        Import Weight Target Data
                    </h2>

                    <div class="space-y-4">
                        <label class="block text-sm font-medium">Select Breed</label>
                        <select v-model="breedId" class="border rounded p-2 w-full">
                            <option disabled value="">
                                -- Choose Breed --
                            </option>
                            <option value="1">
                                Breed A
                            </option>
                            <option value="2">
                                Breed B
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium">Upload Excel File</label>
                        <input type="file" accept=".xlsx,.xls" @change="handleFileUpload">
                    </div>

                    <VBtn color="primary" class="text-white" @click="submitData">
                        Submit
                    </VBtn>

                    <div v-if="tableData.length" class="mt-6">
                        <h3 class="text-lg font-semibold mb-2">
                            Preview Data
                        </h3>

                        <table class="min-w-full border text-sm">
                            <thead>
                                <tr>
                                    <th v-for="(v, key) in tableData[0]" :key="key"
                                        class="border px-2 py-1 bg-gray-100">
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
                </div>
            </VCard>
        </VCol>
    </VRow>
</template>
