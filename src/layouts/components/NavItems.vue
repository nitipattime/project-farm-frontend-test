<script lang="ts" setup>
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';

import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
</script>

<template>
  <!-- 👉 Dashboards -->
  <!--
    <VerticalNavLink :item="{
    title: 'Dashboard',
    icon: 'ri-bar-chart-box-line',
    to: '/dashboardV2',
    }" />
  -->

  <!-- 👉 Dashboard -->
  <VerticalNavLink v-if="auth.user.role === 'user' || auth.user.role === 'admin'" :item="{
    title: 'Dashboard',
    icon: 'ri-bar-chart-box-line',
    to: '/dashboardV2',
  }" />

  <!-- 👉 User Manage -->
  <VerticalNavLink v-if="auth.user.role === 'admin'" :item="{
    title: 'User Manage',
    icon: 'ri-user-settings-line',
    to: '/user-manage',
  }" />

  <!--  to: '/user-manage', -->

  <!-- 👉 Import File -->
  <VerticalNavLink v-if="auth.user.role === 'admin'" :item="{
    title: 'Import File',
    icon: 'ri-file-upload-line',
    to: '/import-file',

  }" />
</template>
