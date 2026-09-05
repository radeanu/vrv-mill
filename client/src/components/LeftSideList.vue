<template>
  <section>
    <div class="section-header">
      <InputNumber v-model="searchId" name="searchLeft" placeholder="Поиск по ID" />
      <InputNumber v-model="newId" name="newId" placeholder="Новый ID" />
      <button
        class="btn"
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
      v-if="list.length || pendingList.length"
      :track-next-page="hasMore"
      :loading="listLoader.isLoading.value"
      class="list"
      @next-page="nextPage"
    >
      <template #list>
        <li v-for="(item, idx) in pendingList" :key="item.key" class="list-item list-item--new">
          <span>#{{ item.id }}</span>
          <span>сохранение...</span>
        </li>

        <li v-for="(item, idx) in list" :key="`${item.id}-${item.idx}-${idx}`" class="list-item">
          <span>#{{ item.id }}</span>
          <button class="btn btn-select" @click="selectItem(item.id, item.idx)">➔</button>
        </li>
      </template>
    </ScrollList>
    <p v-else>Ничего не найдено</p>
  </section>
</template>

<script setup lang="ts">
import { useList } from '@/composables/useList'

import ScrollList from '@/components/ScrollList.vue'
import InputNumber from '@/components/InputNumber.vue'

const {
  list,
  newId,
  hasMore,
  nextPage,
  searchId,
  addNewId,
  addLoader,
  listLoader,
  selectItem,
  pendingList,
  disableAddBtn,
} = useList()
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

  &:hover {
    .btn-select {
      display: flex;
    }
  }
}

.list-item--new {
  cursor: not-allowed;
  background-color: rgba(0, 121, 46, 0.178);
}

.btn {
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
  border-radius: 4px;

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

.btn-select {
  font-size: 20px;
  display: none;
  margin-right: 20px;
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
