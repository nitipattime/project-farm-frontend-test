<script setup>
const chartSeries = [
  {
    name: 'Shipment',
    data: [38, 45, 33, 38, 31, 40, 28],
  },
  {
    name: 'Delivery',
    data: [25, 35, 20, 30, 25, 32, 22],
  },
]

const chartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '45%',
    },
  },
  dataLabels: { enabled: false },
  colors: ['#FFB400', '#9055FD'],
  xaxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  legend: {
    position: 'bottom',
  },
  grid: {
    borderColor: 'rgba(var(--v-border-color), var(--v-border-opacity))',
    strokeDashArray: 8,
  },
}
</script>

<template>
  <VCol
    cols="12"
    md="6"
  >
    <VCard elevation="2">
      <VCardItem>
        <VCardItemContent>
          <VCardTitle>Shipment statistics</VCardTitle>
          <VCardSubtitle>Total number of deliveries 23.8k</VCardSubtitle>
        </VCardItemContent>

        <VCardItemAppend>
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
              <i class="ri-arrow-down-s-line" />
            </VBtn>
          </VBtnGroup>
        </VCardItemAppend>
      </VCardItem>

      <VCardText>
        <Apexchart
          type="bar"
          height="310"
          :options="chartOptions"
          :series="chartSeries"
        />
      </VCardText>
    </VCard>
  </VCol>
</template>
