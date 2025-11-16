<script setup lang="ts">
import FormAddHouseDetail from '@/views/pages/form-layouts/FormAddHouseDetail.vue'

const props = defineProps<{ id: string }>()
</script>

<template>
    <div>
        <VRow>
            <VCol cols="12">
                <!-- 👉 Multiple Column -->
                <VCard title="เพิ่มรายละเอียดการเพาะเลี้ยง">
                    <VCardText>
                        <FormAddHouseDetail :id="props.id" />
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
    </div>
</template>
