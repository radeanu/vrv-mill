<template>
  <section>
    <div class="section-header">
      <InputNumber v-model="searchId" name="searchLeft" placeholder="Поиск по ID" />
      <InputNumber v-model="newId" name="newId" placeholder="Новый ID" />
      <button
        class="btn-add"
        type="button"
        title="Добавить"
        :disabled="disableAddBtn"
        @click="addNewId"
      >
        <span v-if="addLoader.isLoading.value" class="btn-loader" />
        <span v-else>+</span>
      </button>
    </div>

    <ScrollList
      :list
      :page
      :track-next-page="hasMore"
      :loading="listLoader.isLoading.value"
      class="list"
      @next-page="nextPage"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import ScrollList from '@/components/ScrollList.vue'
import InputNumber from '@/components/InputNumber.vue'
import { useList } from '@/composables/useList'

const {
  list,
  page,
  fetchItems,
  nextPage,
  hasMore,
  listLoader,
  addLoader,
  addNewId,
  searchId,
  newId,
  disableAddBtn,
} = useList()

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

.btn-add {
  border: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #d6d6d6;
  cursor: pointer;
  font-size: 30px;

  &:disabled {
    opacity: 0.5;
  }

  &:hover {
    background-color: #8f8f8f;
  }

  &:active {
    background-color: #585858;
  }
}

.btn-loader {
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 4px solid;
  border-color: #000 #0000;
  animation: l1 0.8s infinite linear;
}

@keyframes l1 {
  to {
    transform: rotate(1turn);
  }
}
</style>
