<template>
  <section>
    <div class="section-header">
      <InputNumber v-model="searchId" name="searchLeft" placeholder="Поиск по ID" />
    </div>

    <ScrollList
      v-if="list.length || pendingList.length"
      :track-next-page="hasMore"
      :loading="listLoader.isLoading.value"
      class="list"
      @next-page="nextPage"
    >
      <template #list>
        <li
          v-for="item in pendingList"
          :key="`${item.id}-${item.idx}`"
          class="list-item list-item--new"
        >
          <span>#{{ item.id }}</span>
          <span>сохранение...</span>
        </li>

        <li v-for="item in list" :key="`${item.id}-${item.idx}`" draggable="true" class="list-item">
          <span>#{{ item.id }}</span>
        </li>
      </template>
    </ScrollList>

    <p v-else>Пока пусто, добавьте слева</p>
  </section>
</template>

<script setup lang="ts">
import ScrollList from '@/components/ScrollList.vue'
import InputNumber from '@/components/InputNumber.vue'
import { useSelectedList } from '@/composables/useSelectedList'

const { list, pendingList, nextPage, hasMore, listLoader, searchId } = useSelectedList()
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
  border-bottom: 1px solid #cacaca;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  & span {
    padding: 14px;
  }

  &:last-of-type {
    border-bottom: none;
  }
}

.list-item--new {
  cursor: not-allowed;
  background-color: rgba(0, 121, 46, 0.178);
}
</style>
