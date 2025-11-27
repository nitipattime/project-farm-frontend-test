<script setup lang="ts">
import { computed, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const props = defineProps<{
    data: {
        day_no: number
        date: string | null
        weight_target: number
        weight_target_plus_20: number
        weight_target_minus_20: number
        avg_weight: number | null
    }[]
}>()

// theme
const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

// ───────────────────────────────
// ข้อมูลจาก API / JSON ที่คุณให้มา
// ───────────────────────────────
const weightData = [
    { day_no: 1, weight_target: 54, weight_target_plus_20: 64.8, weight_target_minus_20: 43.2, avg_weight: null },
    { day_no: 2, weight_target: 70, weight_target_plus_20: 84, weight_target_minus_20: 56, avg_weight: null },
    { day_no: 3, weight_target: 88, weight_target_plus_20: 105.6, weight_target_minus_20: 70.4, avg_weight: null },
    { day_no: 16, weight_target: 667, weight_target_plus_20: 800.4, weight_target_minus_20: 533.6, avg_weight: 124.2857 },
    { day_no: 18, weight_target: 810, weight_target_plus_20: 972, weight_target_minus_20: 648, avg_weight: null },
    { day_no: 19, weight_target: 885, weight_target_plus_20: 1062, weight_target_minus_20: 708, avg_weight: null },
    { day_no: 21, weight_target: 1043, weight_target_plus_20: 1251.6, weight_target_minus_20: 834.4, avg_weight: null },
    { day_no: 77, weight_target: 5631, weight_target_plus_20: 6757.2, weight_target_minus_20: 4504.8, avg_weight: null },

    // ... (ใส่ทั้งหมดได้ตามจริง)
]

// ───────────────────────────────
// เตรียมข้อมูลสำหรับกราฟ ApexCharts
// ───────────────────────────────
const seriesPageStats = ref([
    {
        name: 'น้ำหนักเป้าหมาย (Target)',
        data: props.data.map(item => item.weight_target),
    },
    {
        name: '+20%',
        data: props.data.map(item => item.weight_target_plus_20),
    },
    {
        name: '-20%',
        data: props.data.map(item => item.weight_target_minus_20),
    },
    {
        name: 'ค่าเฉลี่ยจริง (Avg Weight)',
        data: props.data.map(item => item.avg_weight ?? null),
    },
])

const chartOptionsPageStats = ref({
    chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false },
    },
    colors: [
        '#01ccff',
        currentTheme.value.error,
        currentTheme.value.error,
        currentTheme.value.success,
    ],
    dataLabels: { enabled: false },
    stroke: {
        width: [3, 2, 2, 4],
        curve: 'smooth',
        dashArray: [0, 5, 5, 0],
    },
    title: {
        text: 'น้ำหนักเป้าหมายเทียบกับค่าเฉลี่ย',
        align: 'left',
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
    },
    markers: {
        size: 3,
        hover: { sizeOffset: 6 },
    },
    xaxis: {
        categories: props.data.map(item => `Day ${item.day_no}`),
        title: { text: 'Day No' },
    },
    yaxis: {
        title: { text: 'Weight (kg)' },
    },
    grid: { borderColor: '#f1f1f1' },
    tooltip: {
        shared: true,
        intersect: false,
        y: { formatter: (val: number) => (val ? `${val.toFixed(2)} kg` : '-') },
    },
})

// const seriesPageStats = ref<any[]>([])
// const chartOptionsPageStats = ref<any>({})

// ฟังก์ชันสร้างกราฟใหม่ทุกครั้งเมื่อ weightData เปลี่ยน
const updateChart = () => {
    seriesPageStats.value = [
        {
            name: 'น้ำหนักเป้าหมาย (Target)',
            data: props.data.map(item => item.weight_target),
        },
        {
            name: '+20%',
            data: props.data.map(item => item.weight_target_plus_20),
        },
        {
            name: '-20%',
            data: props.data.map(item => item.weight_target_minus_20),
        },
        {
            name: 'ค่าเฉลี่ยจริง (Avg Weight)',
            data: props.data.map(item => item.avg_weight ?? null),
        },
    ]

    chartOptionsPageStats.value = {
        chart: {
            height: 350,
            type: 'line',
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        colors: [
            // currentTheme.value.primary,
            '#01ccff',
            currentTheme.value.error,
            currentTheme.value.error,
            currentTheme.value.success,
        ],
        dataLabels: { enabled: false },
        stroke: {
            width: [3, 2, 2, 4],
            curve: 'smooth',
            dashArray: [0, 5, 5, 0],
        },
        title: {
            text: 'น้ำหนักเป้าหมายเทียบกับค่าเฉลี่ย',
            align: 'left',
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        markers: {
            size: 3,
            hover: { sizeOffset: 6 },
        },
        xaxis: {
            categories: props.data.map(item => `Day ${item.day_no}`),
            title: { text: 'Day No' },
        },
        yaxis: {
            title: { text: 'Weight (kg)' },
            labels: {
                formatter: (val: number) => val.toFixed(4),
            },
        },
        grid: { borderColor: '#f1f1f1' },
        tooltip: {
            shared: true,
            intersect: false,
            y: { formatter: (val: number) => (val ? `${val.toFixed(2)} kg` : '-') },
        },
    }
}

// เรียกเมื่อเริ่มต้น และเมื่อ prop เปลี่ยน
watch(
    () => props.data,
    updateChart,
    { immediate: true },
)
</script>

<template>
    <VCard>
        <VCardItem>
            <div>
                <VCardTitle>Weight Progress</VCardTitle>
                <VCardSubtitle>Target, +20%, -20%, and Average Weight</VCardSubtitle>
            </div>
        </VCardItem>
        <!-- {{ props.data }} -->

        <VCardText>
            <VueApexCharts id="weight-statistics" type="line" height="350" :options="chartOptionsPageStats"
                :series="seriesPageStats" />
        </VCardText>
    </VCard>
</template>
