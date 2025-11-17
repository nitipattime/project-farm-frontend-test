<script lang="ts" setup>
interface MenuItem {
  title: string
  value: string
}

interface Props {
  menuList?: MenuItem[]
  iconSize?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['selected'])
</script>

<template>
  <IconBtn>
    <VIcon :size="props.iconSize" icon="ri-more-2-line" />

    <VMenu activator="parent">
      <VList>
        <VListItem v-for="item in props.menuList" :key="item.value" @click="emit('selected', item.value)">
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </IconBtn>
</template>
