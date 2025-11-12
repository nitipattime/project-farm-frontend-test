<script setup lang="ts">
import { computed } from 'vue';

// ✅ กำหนด props ที่ component นี้รับได้
const props = defineProps<{
    data: {
        year: string
        month: string
        cv: number
    }[]
}>()

// ✅ ฟังก์ชันแปลงเลขเดือนเป็นชื่อเดือน (ถ้าต้องการให้ดูอ่านง่าย)
const monthNames = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
]

// ✅ แปลงข้อมูลจาก props.data ให้อยู่ในรูปที่พร้อมแสดงผล
const formattedData = computed(() =>
    props.data.map(item => ({
        title: `${monthNames[Number.parseInt(item.month) - 1]} ${item.year}`,
        value: item.cv.toFixed(2),
        change: item.cv > 1 ? '+เพิ่มขึ้น' : '-ลดลง',
        color: item.cv > 1 ? 'success' : 'error',
    })),
)
</script>

<template>
    <VCard>
        <VCardItem>
            <VCardTitle>น้ำหนักโดยเฉลี่ย</VCardTitle>
            <div class="text-body-1">
                ต่อเดือน
            </div>
        </VCardItem>

        <VCardText>
            <VList class="card-list">
                <VListItem v-for="(item, index) in formattedData" :key="index">
                    <VListItemTitle class="mb-1 d-flex align-center">
                        <h6 class="text-h6">
                            {{ item.value }}
                        </h6>

                        <VIcon size="24" :color="item.color" class="mx-1">
                            {{ item.color === 'success' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line' }}
                        </VIcon>

                        <div :class="`text-${item.color}`" class="text-body-1">
                            {{ item.change }}
                        </div>
                    </VListItemTitle>

                    <VListItemSubtitle class="text-body-1 me-2">
                        {{ item.title }}
                    </VListItemSubtitle>

                    <template #append>
                        <div class="text-end">
                            <h6 class="text-h6 mb-1">
                                {{ item.value }}
                            </h6>
                            <div class="text-body-2 text-disabled">
                                CV
                            </div>
                        </div>
                    </template>
                </VListItem>
            </VList>
        </VCardText>
    </VCard>
</template>

<style scoped lang="scss">
.card-list {
    --v-card-list-gap: 0.875rem;
}
</style>
