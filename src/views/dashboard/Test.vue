<script setup lang="ts">
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()

const currentTheme = computed(() => vuetifyTheme.current.value.colors)

// Series (ข้อมูล)
const series = ref([
  {
    name: 'High - 2013',
    data: [28, 29, 33, 36, 32, 32, 33],
  },
  {
    name: 'Low - 2013',
    data: [12, 11, 14, 18, 17, 13, 13],
  },
])

// Chart options (ตั้งค่ากราฟ)
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.5,
    },
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  colors: [currentTheme.value.warning, currentTheme.value.primary],
  dataLabels: { enabled: true },
  stroke: { curve: 'smooth' },
  title: {
    text: 'Average High & Low Temperature',
    align: 'left',
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5,
    },
  },
  markers: { size: 1 },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    title: { text: 'Month' },
  },
  yaxis: {
    title: { text: 'Temperature' },
    min: 5,
    max: 40,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
})

// const series = [
//   { name: 'Shipment', data: [38, 45, 33, 38, 31, 40, 28] },
//   { name: 'Delivery', data: [25, 35, 20, 30, 25, 32, 22] },
// ]

// const chartOptions = computed(() => ({
//   chart: {
//     type: 'bar',
//     toolbar: { show: false },
//     parentHeightOffset: 0,
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 4,
//       columnWidth: '45%',
//     },
//   },
//   dataLabels: { enabled: false },
//   colors: [currentTheme.value.warning, currentTheme.value.primary],
//   xaxis: {
//     categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     labels: {
//       style: {
//         colors: currentTheme.value['on-background'],
//       },
//     },
//   },
//   legend: {
//     position: 'bottom',
//     labels: {
//       colors: currentTheme.value['on-background'],
//     },
//   },
//   grid: {
//     borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
//     strokeDashArray: 8,
//   },
// }))

// const series = [
//   {
//     name: '2020',
//     data: [35, 85, 55, 50, 70],
//   },
// ]

// const chartOptions = computed(() => {
//   const backgroundColor = currentTheme.value['track-bg']

//   return {
//     chart: {
//       type: 'bar',
//       stacked: false,
//       width: 200,
//       parentHeightOffset: 0,
//       toolbar: {
//         show: false,
//       },
//     },
//     grid: {
//       show: false,
//       padding: {
//         top: -20,
//         left: -7,
//         right: 0,
//         bottom: -5,
//       },
//     },
//     colors: [currentTheme.value.error, currentTheme.value.primary, currentTheme.value.error, currentTheme.value.primary, currentTheme.value.primary],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '20%',
//         borderRadius: 4,
//         distributed: true,
//         colors: {
//           backgroundBarColors: [backgroundColor, backgroundColor, backgroundColor, backgroundColor, backgroundColor],
//           backgroundBarRadius: 5,
//         },
//       },
//     },
//     legend: {
//       show: false,
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     xaxis: {
//       labels: {
//         show: false,
//       },
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       show: false,
//     },
//     tooltip: {
//       enabled: false,
//     },
//     responsive: [
//       {
//         breakpoint: 1628,
//         options: {
//           plotOptions: {
//             bar: {
//               columnWidth: '20%',
//               borderRadius: 2,
//             },
//           },
//         },
//       },
//       {
//         breakpoint: 960,
//         options: {
//           plotOptions: {
//             bar: {
//               columnWidth: '15%',
//               borderRadius: 6,
//             },
//           },
//         },
//       },
//       {
//         breakpoint: 725,
//         options: {
//           plotOptions: {
//             bar: {
//               columnWidth: '15%',
//               borderRadius: 4,
//             },
//           },
//         },
//       },
//     ],
//   }
// })
</script>

<template>
  <VCard>
    <VCardItem>
      <div>
        <VCardTitle>Shipment statistics</VCardTitle>
        <VCardSubtitle>Total number of deliveries 23.8k</VCardSubtitle>
      </div>

      <template #append>
        <VBtnGroup
          divided
          density="compact"
        >
          <VBtn
            variant="outlined"
            color="primary"
          >
            January
          </VBtn>
          <VBtn
            icon
            variant="outlined"
            color="primary"
          >
            <VIcon icon="ri-arrow-down-s-line" />
          </VBtn>
        </VBtnGroup>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts
        id="shipment-statistics"
        type="line"
        height="310"
        :options="chartOptions"
        :series="series"
      />
    </VCardText>
  </VCard>
  <!--
    <VCard>
    <VCardText>
    <h4 class="text-h4">
    2,856
    </h4>

    <VueApexCharts
    :options="chartOptions"
    :series="series"
    :height="80"
    class="my-1"
    />

    <h6 class="text-h6 text-center">
    Sessions
    </h6>
    </VCardText>
    </VCard>
  -->
</template>
