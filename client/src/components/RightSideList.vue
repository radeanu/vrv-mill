<template>
  <section>
    <div class="section-header">
      <InputNumber v-model="searchId" name="searchLeft" placeholder="Поиск по ID" />
    </div>

    <ScrollList
      v-if="list.length"
      :list
      :page
      :track-next-page="hasMore"
      :loading="listLoader.isLoading.value"
      class="list"
      @next-page="nextPage"
    >
      <template #list>
        <li v-for="item in list" :key="`${item.id}-${item.idx}`" draggable="true" class="list-item">
          #{{ item.id }}
        </li>
      </template>
    </ScrollList>

    <p v-else>Пока пусто, перетащите слева</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ScrollList from '@/components/ScrollList.vue'
import InputNumber from '@/components/InputNumber.vue'
import { useSelectedList } from '@/composables/useSelectedList'

const { list, page, fetchItems, nextPage, hasMore, listLoader, searchId } = useSelectedList()

onMounted(fetchItems)
</script>

<style scoped>
.section-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #8f8f8f;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  column-gap: 10px;
  align-items: center;
}

.list {
  height: 85dvh;
}

.list-item {
  padding: 14px;
  border-bottom: 1px solid #cacaca;

  &:last-of-type {
    border-bottom: none;
  }
}
</style>
