<template>
  <ScrollList :list :offset :limit />
</template>

<script setup lang="ts">
import ScrollList from '@/components/ScrollList.vue'

import { useList } from '@/composables/useList'
import { onMounted } from 'vue'

const { list, offset, limit, fetchItems, nextPage } = useList()

onMounted(async () => {
  await fetchItems()
})
</script>

<style scoped></style>
