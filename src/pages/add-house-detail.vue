<script setup lang="ts">
import FormAddHouseDetail from '@/views/pages/form-layouts/FormAddHouseDetail.vue';
</script>

<template>
    <div>
        <VRow>
            <VCol cols="12">
                <!-- 👉 Multiple Column -->
                <VCard title="เพิ่มรายละเอียดการเพาะเลี้ยง">
                    <VCardText>
                        <FormAddHouseDetail />
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
    </div>
</template>
