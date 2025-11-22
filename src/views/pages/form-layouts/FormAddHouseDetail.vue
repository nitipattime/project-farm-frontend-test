<script lang="ts" setup>
import { createHouseDetail } from '@/services/houseService';
import { useHouseStore } from '@/stores/houseStore';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router'; // 👈 เพิ่มบรรทัดนี้
import { VBtn, VCol, VDatePicker, VForm, VRow, VSelect, VTextField } from 'vuetify/components';

const props = defineProps<{ id: string }>()
const router = useRouter()
const formRef = ref()

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

const form = reactive({
    house_name: '',
    animal_type: '',
    breed: '',
    sex: 'male',
    silo_id: '',
    machine1: '',
    sn_machine1: '',
    machine2: '',
    sn_machine2: '',
    qty: '',
    weight_target: '',
    food: '',
    start_date: null,
    end_date: null,
    uniform: '',
})

const errors = reactive({
    house_name: '',
    animal_type: '',
    breed: '',
    sex: '',
    silo: '',
    machine1: '',
    qty: '',
    weight_target: '',
    food: '',
    date_range: '',
    uniform: '',
})

// Options example
// const siloOptions = [
//     { title: 'Silo 1', value: 1 },
//     { title: 'Silo 2', value: 2 },
// ]

// const machineOptions = [
//     { title: 'Machine 1', value: 'M1' },
//     { title: 'Machine 2', value: 'M2' },
// ]

// Counter
function countHouseNameLength() { }
function countAnimalTypeLength() { }
function countBreedLength() { }
function countSexLength() { }
function countQTYLength() { }
function countWeightTargetLength() { }
function countFoodLength() { }
function countUniformLength() { }

function submitForm() {
    console.log('Submit', form)
}

function goBack() {
    router.back()
}

const startPicker = ref(false)
const endPicker = ref(false)
const firstName = ref('')
const lastName = ref('')
const city = ref('')
const country = ref('')
const company = ref('')
const email = ref('')
const checkbox = ref(false)

// fetchMachineAvailable
const houseStore = useHouseStore()
const siloOptions = ref<{ title: string; value: number }[]>([])
const machineOptions = ref<{ title: string; value: number }[]>([])
const breedOptions = ref<{ title: string; value: number }[]>([])

const houseId = Number.parseInt(props.id || '0', 10)

async function handleGetMachineAvailable() {
    try {
        const res = await houseStore.fetchMachineAvailable()

        // const res =
        // machineOptions.value = res.data.map((item: any) => ({
        //     title: item.name,
        //     value: item.id,
        // }))

        // if (machineOptions.value.length > 0)
        //     form.machine1 = machineOptions.value[0].value
        machineOptions.value = res.data.map((item: any) => ({
            title: item.sn, // หรือ `${item.sn} (${item.mac})` ถ้าอยากเห็น mac ด้วย
            value: item.id,
        }))

        // ตั้ง default ให้เครื่องชั่ง 1 เป็นตัวแรก
        if (machineOptions.value.length > 0)
            form.machine1 = machineOptions.value[0].value
    }
    catch (err) {
        console.error(err)
    }
}

const machine2Options = computed(() => {
    // if (!houseStore.machines?.length)
    //     return []
    // if (!form.machine1)
    //     return houseStore.machines

    if (!machineOptions.value.length)
        return []

    return machineOptions.value.filter(m => m.value !== form.machine1)

    // return houseStore.machines.filter(m => m.mac !== form.machine1)

    // return machineOptions.value.filter(
    //     m => m.value !== form.value.machine1,
    // )
})

async function handleGetMachineSilos() {
    try {
        const res = await houseStore.fetchMachineSilos()

        //
        siloOptions.value = res.data.map((item: any) => ({
            title: item.name,
            value: item.id,
        }))

        if (siloOptions.value.length > 0)
            form.silo_id = siloOptions.value[0].value
    }
    catch (err) {
        console.error(err)
    }
}

// watch(
//     [() => houseStore.machines, () => form.machine1],
//     ([machines, machine1]) => {
//         if (machines.length && machine1)
//             console.log('Filtered:', machines.filter(m => m.mac !== machine1))
//     },
//     { deep: true },
// )

// const machineOptions2 = computed(() => {
//     if (!houseStore.machines?.length)
//         return []
//     if (!form.machine1)
//         return houseStore.machines

//     return houseStore.machines.filter(m => m.mac !== form.machine1)

//     //   return houseStore.machines.filter(m => m.mac !== form.machine1)
// })

// const siloOptions2 = computed(() => {
//     if (!houseStore.silos?.length)
//         return []
//     if (!form.silo_name)
//         return houseStore.silos

//     return houseStore.silos.filter(m => m.name !== form.silo_name)

//     //   return houseStore.machines.filter(m => m.mac !== form.machine1)
// })

async function handleGetChickenBreed() {
    try {
        const res = await houseStore.fetchChickenBreed()

        breedOptions.value = res.data.map((item: string, index: number) => ({
            title: item, // ใช้ตัว string เป็น title
            value: item, // value เป็น string ก็ได้ (ถ้า DB ต้องการ index ก็ใช้ index)
            // value: index      // ถ้าต้องการให้ value เป็นตัวเลข
        }))

        if (breedOptions.value.length > 0)
            form.breed = breedOptions.value[0].value // เซ็ตค่า default
    }
    catch (err) {
        console.error(err)
    }
}

function mapMachine(value: number) {
    const found = machineOptions.value.find(m => m.value === value)

    return found
        ? { mac: found.title, sn: String(found.value) }
        : null
}

// ✅ สร้าง API call สำหรับสร้างข้อมูลใหม่
async function handleCreateHouse() {
    try {
        console.log(`houseID: ${props.id}`)

        const machines: any[] = []

        if (form.machine1) {
            const m1 = mapMachine(form.machine1)
            if (m1)
                machines.push(m1)
        }

        if (form.machine2) {
            const m2 = mapMachine(form.machine2)
            if (m2)
                machines.push(m2)
        }

        console.log(machines)

        const payload = {
            qty: Number.parseInt(form.qty || '0', 10),
            weight_target: Number.parseInt(form.weight_target || '0', 10),
            type: form.animal_type,
            food: form.food,
            breed: form.breed,
            sex: form.sex,
            machine: machines,
            start_date: form.start_date,
            end_date: form.end_date,
            uniform: form.uniform,
            silo: form.silo_id,
        }

        console.log(payload)

        const res = await createHouseDetail(payload, props.id)

        // console.log('✅ สร้างโรงเรือนสำเร็จ', res)

        // router.push('/house') // 👉 redirect กลับไปหน้า list หลังสร้างสำเร็จ
        if (res) {
            // showConfirm.value = false
            // triggerSuccessModal()
            showAlert('success', 'บันทึกข้อมูลโรงเรือนเรียบร้อยแล้ว')
            setTimeout(() => {
                router.back()
            }, 2500)
        }
    }
    catch (err: any) {
        console.error('❌ สร้างโรงเรือนไม่สำเร็จ', err)
        showAlert('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่')

        // ถ้ามี message จาก backend
        // if (err.response?.data?.message)
        //     alert(err.response.data.message)
    }
}

// function submitForm() {
//     handleCreateHouse()
// }

async function handleGetHouseSummary() {
    const params = {
        houseID: props.id,
    }

    try {
        const res = await houseStore.fetchHouseSummary(params)
        const data = res?.data

        if (data && Object.keys(data).length > 0) {
            const formatDate = (dateStr: string | null | undefined) => {
                if (!dateStr)
                    return ''
                const d = new Date(dateStr)

                return d.toISOString().split('T')[0]
            }

            form.house_name = data.house_name || ''
            form.animal_type = data.type || ''
            form.breed = data.breed || ''
            form.sex = data.sex || ''
            form.qty = data.total_qty?.toString() || ''
            form.weight_target = data.weight_target?.toString() || ''
            form.food = data.food || ''
            // form.start_date = data.start_date || ''
            // form.end_date = data.end_date || ''
            form.uniform = data.uniform_field || ''
            form.silo_id = data.silo?.id || ''

            // 🟢 Map เครื่องชั่งกลับเป็น id
            if (data.machines?.length > 0) {
                const m1 = data.machines[0]
                const found1 = machineOptions.value.find(m => m.title === m1.sn)

                form.machine1 = found1 ? found1.value : ''

                if (data.machines[1]) {
                    const m2 = data.machines[1]
                    const found2 = machineOptions.value.find(m => m.title === m2.sn)

                    form.machine2 = found2 ? found2.value : ''
                }
            }
        }
    }
    catch (err) {
        console.error(err)
        showAlert('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
}

const initialize = async () => {
    await handleGetHouseSummary()
    await handleGetMachineAvailable()
    await handleGetMachineSilos()
    await handleGetChickenBreed()

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

    // console.log(`houseID: ${props.id}`)
})

// Dialog control
const confirmDialog = ref(false)

// ฟังก์ชัน submit ของฟอร์ม
function onSubmitForm() {
    confirmDialog.value = true // เปิด dialog
}

// ฟังก์ชันยืนยันการสร้าง
async function onConfirmCreate() {
    confirmDialog.value = false
    await handleCreateHouse()
}
</script>

<template>
    <VOverlay v-model="alert.show" class="d-flex align-center justify-center" scrim>
        <VAlert :type="alert.type" border="start" elevation="2" class="mb-4">
            <strong>{{ alert.message }}</strong>
        </VAlert>
        <!-- <VAlert v-if="alert.show" :type="alert.type" class="mb-4" border="start" elevation="2" /> -->
    </VOverlay>
    <VForm @submit.prevent="onSubmitForm">
        <VRow>
            <!-- 👉 First Name -->
            <!-- คอลัมน์ซ้าย -->
            <VCol cols="12" md="6">
                <!-- โรงเรือน -->
                <VTextField v-model="form.house_name" label="โรงเรือน *" placeholder="ระบุโรงเรือน" counter="100"
                    :error-messages="errors.house_name" @input="countHouseNameLength" />

                <!-- ประเภทของสัตว์ -->
                <VTextField v-model="form.animal_type" label="ประเภทของสัตว์ *" placeholder="ระบุประเภทของสัตว์"
                    counter="100" :error-messages="errors.animal_type" class="mt-4" @input="countAnimalTypeLength" />

                <!-- สายพันธุ์ -->
                <!--
          <VTextField v-model="form.breed" label="สายพันธุ์ *" placeholder="ระบุสายพันธุ์" counter="100"
          :error-messages="errors.breed" class="mt-4" @input="countBreedLength" />
        -->
                <VSelect v-model="form.breed" :items="breedOptions" label="สายพันธุ์ *" placeholder="เลือก สายพันธุ์"
                    :error-messages="errors.breed" />

                <!-- เพศ + Silo -->
                <VRow class="mt-4">
                    <VCol cols="6">
                        <!--
              <VTextField v-model="form.sex" label="เพศ *" placeholder="ระบุเพศ" counter="5"
              :error-messages="errors.sex" @input="countSexLength" />
            -->
                        <VSelect v-model="form.sex" label="เพศ *" placeholder="เลือกเพศ" :items="[
                            { title: 'เพศผู้', value: 'male' },
                            { title: 'เพศเมีย', value: 'female' },
                        ]" :error-messages="errors.sex" />
                    </VCol>
                    <VCol cols="6">
                        <VSelect v-model="form.silo_id" :items="siloOptions" label="Silo *" placeholder="เลือก Silo"
                            :error-messages="errors.silo" />
                    </VCol>
                </VRow>

                <!-- เครื่องชั่ง 1 + 2 -->
                <VRow class="mt-4">
                    <VCol cols="6">
                        <VSelect v-model="form.machine1" :items="machineOptions" label="เครื่องชั่ง 1 *"
                            placeholder="เลือกเครื่องชั่ง" :error-messages="errors.machine1" />
                    </VCol>
                    <VCol cols="6">
                        <VSelect v-model="form.machine2" :items="machine2Options" label="เครื่องชั่ง 2"
                            placeholder="เลือกเครื่องชั่ง" />
                    </VCol>
                </VRow>
            </VCol>

            <!-- คอลัมน์ขวา -->
            <VCol cols="12" md="6">
                <!-- จำนวนสัตว์ + เป้าหมายน้ำหนัก -->
                <VRow>
                    <VCol cols="12">
                        <VTextField v-model="form.qty" label="จำนวนสัตว์ที่เลี้ยงในฟาร์ม *" placeholder="ระบุจำนวนสัตว์"
                            counter="13" type="number" :error-messages="errors.qty" @input="countQTYLength" />
                    </VCol>
                    <!--
            <VCol cols="6">
            <VTextField v-model="form.weight_target" label="เป้าหมายน้ำหนัก *"
            placeholder="ระบุน้ำหนัก (กรัม)" counter="13" type="number"
            :error-messages="errors.weight_target" @input="countWeightTargetLength" />
            </VCol>
          -->
                </VRow>

                <!-- สูตรอาหาร -->
                <VTextField v-model="form.food" label="สูตรอาหาร *" placeholder="กรอกสูตรอาหารของคุณ" counter="100"
                    :error-messages="errors.food" class="mt-4" @input="countFoodLength" />

                <!-- วันที่เริ่ม + สิ้นสุด -->
                <!--
          <VRow class="mt-4">
          <VCol cols="6">
          <VTextField v-model="form.start_date" label="วันที่เริ่มเลี้ยง *" type="date" />
          </VCol>
          <VCol cols="6">
          <VTextField v-model="form.end_date" label="วันที่คาดว่าจะสิ้นสุด *" type="date" />
          </VCol>
          </VRow>
        -->

                <VRow class="">
                    <!-- วันที่เริ่มเลี้ยง -->
                    <VCol cols="12" md="6">
                        <VTextField label="วันที่เริ่มเลี้ยง *" prepend-inner-icon="ri-calendar-line" readonly
                            :value="form.start_date" @click="startPicker = true" />

                        <VDialog v-model="startPicker" width="320">
                            <VCard>
                                <VDatePicker v-model="form.start_date" :max="form.end_date || undefined"
                                    @update:model-value="startPicker = false" />
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn text @click="startPicker = false">
                                        ยกเลิก
                                    </VBtn>
                                    <VBtn text color="primary" @click="startPicker = false">
                                        ตกลง
                                    </VBtn>
                                </VCardActions>
                            </VCard>
                        </VDialog>
                    </VCol>

                    <VCol cols="12" md="6">
                        <VTextField label="วันที่คาดว่าจะสิ้นสุด *" prepend-inner-icon="ri-calendar-line" readonly
                            :value="form.end_date" @click="endPicker = true" />

                        <VDialog v-model="endPicker" width="320">
                            <VCard>
                                <VDatePicker v-model="form.end_date" :min="form.start_date || undefined"
                                    @update:model-value="endPicker = false" />
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn text @click="endPicker = false">
                                        ยกเลิก
                                    </VBtn>
                                    <VBtn text color="primary" @click="endPicker = false">
                                        ตกลง
                                    </VBtn>
                                </VCardActions>
                            </VCard>
                        </VDialog>
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField v-model="form.start_date" label="วันที่เริ่มเลี้ยง *"
                            prepend-inner-icon="ri-calendar-line" readonly
                            :value="form.start_date ? new Date(form.start_date).toISOString().split('T')[0] : ''"
                            @click="startPicker = true" />

                        <VDialog v-model="startPicker" width="390">
                            <VCard>
                                <VCardText>
                                    <VDatePicker v-model="form.start_date" />
                                </VCardText>
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn text @click="startPicker = false">
                                        ยกเลิก
                                    </VBtn>
                                    <VBtn text color="primary" @click="startPicker = false">
                                        ตกลง
                                    </VBtn>
                                </VCardActions>
                            </VCard>
                        </VDialog>

                        <VTextField v-model="form.start_date" label="วันที่เริ่มเลี้ยง *"
                            prepend-inner-icon="ri-calendar-line" readonly @click="startPicker = true" />

                        <!--
              <VDialog v-model="startPicker" width="290px">
              <VCard>
              <VCardText>
              <VDatePicker v-model="form.start_date" />
              </VCardText>
              <VCardActions>
              <VSpacer />
              <VBtn text="ยกเลิก" @click="startPicker = false" />
              <VBtn text="ตกลง" color="primary" @click="startPicker = false" />
              </VCardActions>
              </VCard>
              </VDialog>
            -->
                        <VDialog v-model="startPicker" width="390px">
                            <VCard>
                                <VCardText>
                                    <VDatePicker v-model="form.start_date" />
                                </VCardText>
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn text="ยกเลิก" @click="startPicker = false" />
                                    <VBtn text="ตกลง" color="primary" @click="startPicker = false" />
                                </VCardActions>
                            </VCard>
                        </VDialog>
                    </VCol>

                    <!-- วันที่คาดว่าจะสิ้นสุด -->
                    <VCol cols="12" md="6">
                        <VTextField v-model="form.end_date" label="วันที่คาดว่าจะสิ้นสุด *"
                            prepend-inner-icon="ri-calendar-line" readonly @click="endPicker = true" />

                        <VDialog v-model="endPicker" width="390px">
                            <VCard>
                                <VCardText>
                                    <VDatePicker v-model="form.end_date" />
                                </VCardText>
                                <VCardActions>
                                    <VSpacer />
                                    <VBtn text="ยกเลิก" @click="endPicker = false" />
                                    <VBtn text="ตกลง" color="primary" @click="endPicker = false" />
                                </VCardActions>
                            </VCard>
                        </VDialog>
                    </VCol>
                </VRow>

                <!-- Uniform -->
                <VTextField v-model="form.uniform" label="สัดส่วนของไก่ (Uniform%) *" placeholder="ระบุสัดส่วนของไก่"
                    counter="5" type="number" :error-messages="errors.uniform" class="mt-4"
                    @input="countUniformLength" />
            </VCol>
        </VRow>

        <VRow>
            <VCol cols="12" class="d-flex justify-space-between align-center mb-6">
                <VBtn type="reset" color="secondary" variant="outlined" @click="goBack">
                    ยกเลิก
                </VBtn>

                <VBtn type="submit">
                    ยืนยัน
                </VBtn>
                <!-- @submit.prevent="submitForm" -->
            </VCol>
            <!--
        <div class="d-flex justify-space-between align-center mb-6">
        <VTextField v-model="searchQuery" placeholder="ค้นหา" persistent-placeholder
        :loading="loading" append-inner-icon="mdi-magnify" clearable hide-details
        variant="outlined" density="comfortable" style="max-width: 300px"
        @click:append-inner="onSearch" />

        <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="dialog = true">
        เพิ่มฟาร์ม
        </VBtn>
        </div>
      -->
        </VRow>
    </VForm>

    <!-- Confirm Dialog -->
    <VDialog v-model="confirmDialog" max-width="400">
        <VCard>
            <VCardTitle class="text-h6">
                ยืนยันการสร้างโรงเรือน
            </VCardTitle>
            <VCardText>
                คุณต้องการสร้างโรงเรือนใช่หรือไม่?
            </VCardText>
            <VCardActions>
                <VSpacer />
                <VBtn text color="secondary" @click="confirmDialog = false">
                    ยกเลิก
                </VBtn>
                <VBtn text color="primary" @click="onConfirmCreate">
                    ยืนยันการสร้าง
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>
