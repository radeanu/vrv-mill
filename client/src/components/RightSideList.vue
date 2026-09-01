<template>
  <ScrollList :list :page :limit />
</template>

<script setup lang="ts">
import ScrollList from '@/components/ScrollList.vue'

import { useList } from '@/composables/useList'
import { onMounted } from 'vue'

const { list, page, limit, fetchItems, nextPage } = useList()

onMounted(async () => {
  await fetchItems()
})
</script>

<style scoped></style>
