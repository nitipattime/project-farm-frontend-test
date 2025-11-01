<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { VBtn, VCol, VForm, VRow, VSelect, VTextField } from 'vuetify/components'

const formRef = ref()

const form = reactive({
    house_name: '',
    animal_type: '',
    breed: '',
    sex: '',
    silo_id: '',
    machine1: '',
    machine2: '',
    qty: '',
    weight_target: '',
    food: '',
    start_date: '',
    end_date: '',
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
const siloOptions = [
    { title: 'Silo 1', value: 1 },
    { title: 'Silo 2', value: 2 },
]

const machineOptions = [
    { title: 'Machine 1', value: 'M1' },
    { title: 'Machine 2', value: 'M2' },
]

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
    console.log('Go Back')
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
</script>

<template>
    <VForm @submit.prevent="() => { }">
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
                <VTextField v-model="form.breed" label="สายพันธุ์ *" placeholder="ระบุสายพันธุ์" counter="100"
                    :error-messages="errors.breed" class="mt-4" @input="countBreedLength" />

                <!-- เพศ + Silo -->
                <VRow class="mt-4">
                    <VCol cols="6">
                        <VTextField v-model="form.sex" label="เพศ *" placeholder="ระบุเพศ" counter="5"
                            :error-messages="errors.sex" @input="countSexLength" />
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
                        <VSelect v-model="form.machine2" :items="machineOptions" label="เครื่องชั่ง 2"
                            placeholder="เลือกเครื่องชั่ง" />
                    </VCol>
                </VRow>
            </VCol>

            <!-- คอลัมน์ขวา -->
            <VCol cols="12" md="6">
                <!-- จำนวนสัตว์ + เป้าหมายน้ำหนัก -->
                <VRow>
                    <VCol cols="6">
                        <VTextField v-model="form.qty" label="จำนวนสัตว์ที่เลี้ยงในฟาร์ม *" placeholder="ระบุจำนวนสัตว์"
                            counter="13" type="number" :error-messages="errors.qty" @input="countQTYLength" />
                    </VCol>
                    <VCol cols="6">
                        <VTextField v-model="form.weight_target" label="เป้าหมายน้ำหนัก *"
                            placeholder="ระบุน้ำหนัก (กรัม)" counter="13" type="number"
                            :error-messages="errors.weight_target" @input="countWeightTargetLength" />
                    </VCol>
                </VRow>

                <!-- สูตรอาหาร -->
                <VTextField v-model="form.food" label="สูตรอาหาร *" placeholder="กรอกสูตรอาหารของคุณ" counter="100"
                    :error-messages="errors.food" class="mt-4" @input="countFoodLength" />

                <!-- วันที่เริ่ม + สิ้นสุด -->
                <!-- <VRow class="mt-4">
                    <VCol cols="6">
                        <VTextField v-model="form.start_date" label="วันที่เริ่มเลี้ยง *" type="date" />
                    </VCol>
                    <VCol cols="6">
                        <VTextField v-model="form.end_date" label="วันที่คาดว่าจะสิ้นสุด *" type="date" />
                    </VCol>
                </VRow> -->

                <VRow class="mt-4">
                    <!-- วันที่เริ่มเลี้ยง -->
                    <VCol cols="12" md="6">
                        <VTextField v-model="form.start_date" label="วันที่เริ่มเลี้ยง *"
                            prepend-inner-icon="mdi-calendar" readonly @click="startPicker = true" />

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
                    </VCol>

                    <!-- วันที่คาดว่าจะสิ้นสุด -->
                    <VCol cols="12" md="6">
                        <VTextField v-model="form.end_date" label="วันที่คาดว่าจะสิ้นสุด *"
                            prepend-inner-icon="mdi-calendar" readonly @click="endPicker = true" />

                        <VDialog v-model="endPicker" width="290px">
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

            <VCol md="6">
                <VSpacer>
                    <VTextField v-model="firstName" label="โรงเรือน" placeholder="John" />
                </VSpacer>
                <VSpacer class="mt-6">
                    <VTextField v-model="lastName" label="ประเภทของสัตว์" placeholder="Doe" />
                </VSpacer>
                <VSpacer class="mt-6">
                    <VTextField v-model="lastName" label="สายพันธุ์" placeholder="Doe" />
                </VSpacer>
                <VCol cols="12" class="mt-6">
                    <VSpacer md="3">
                        <VTextField v-model="lastName" label="สายพันธุ์" placeholder="Doe" />
                    </VSpacer>
                    <VSpacer md="3">
                        <VTextField v-model="lastName" label="สายพันธุ์" placeholder="Doe" />
                    </VSpacer>
                </VCol>
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="6" md="6">
                <VTextField v-model="lastName" label="Last Name" placeholder="Doe" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12" md="6">
                <VTextField v-model="email" label="Email" placeholder="johndoe@email.com" />
            </VCol>

            <!-- 👉 City -->
            <VCol cols="12" md="6">
                <VTextField v-model="city" label="City" placeholder="New York" />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12" md="6">
                <VTextField v-model="country" label="Country" placeholder="United States" />
            </VCol>

            <!-- 👉 Company -->
            <VCol cols="12" md="6">
                <VTextField v-model="company" label="Company" placeholder="Pixinvent" />
            </VCol>

            <!-- 👉 Remember me -->
            <VCol cols="12">
                <VCheckbox v-model="checkbox" label="Remember me" />
            </VCol>
        </VRow>


        <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
                <VTextField v-model="firstName" label="First Name" placeholder="John" />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="12" md="6">
                <VTextField v-model="lastName" label="Last Name" placeholder="Doe" />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12" md="6">
                <VTextField v-model="email" label="Email" placeholder="johndoe@email.com" />
            </VCol>

            <!-- 👉 City -->
            <VCol cols="12" md="6">
                <VTextField v-model="city" label="City" placeholder="New York" />
            </VCol>

            <!-- 👉 Country -->
            <VCol cols="12" md="6">
                <VTextField v-model="country" label="Country" placeholder="United States" />
            </VCol>

            <!-- 👉 Company -->
            <VCol cols="12" md="6">
                <VTextField v-model="company" label="Company" placeholder="Pixinvent" />
            </VCol>

            <!-- 👉 Remember me -->
            <VCol cols="12">
                <VCheckbox v-model="checkbox" label="Remember me" />
            </VCol>

            <VCol cols="12" class="d-flex justify-space-between align-center mb-6">
                <VBtn type="reset" color="secondary" variant="outlined">
                    ยกเลิก
                </VBtn>

                <VBtn type="submit">
                    ยืนยัน
                </VBtn>
            </VCol>
            <!-- <div class="d-flex justify-space-between align-center mb-6">
                            <VTextField v-model="searchQuery" placeholder="ค้นหา" persistent-placeholder
                                :loading="loading" append-inner-icon="mdi-magnify" clearable hide-details
                                variant="outlined" density="comfortable" style="max-width: 300px"
                                @click:append-inner="onSearch" />

                            <VBtn color="primary" class="text-white" v-bind="activatorProps" @click="dialog = true">
                                เพิ่มฟาร์ม
                            </VBtn>
                        </div> -->
        </VRow>
    </VForm>
</template>
