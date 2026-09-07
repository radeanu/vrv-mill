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
          <span>сохранение...</span>
          <span>#{{ item.id }}</span>
        </li>

        <li
          v-for="item in list"
          :key="`${item.id}-${item.idx}`"
          class="list-item"
          :data-id="item.id"
          :data-idx="item.idx"
          @mousemove="onMouseMoveOnLi"
        >
          <button class="btn-drag" @mousedown="onDragInit">⣿</button>
          <span>#{{ item.id }}</span>
        </li>
      </template>
    </ScrollList>

    <p v-else>Пока пусто, добавьте слева</p>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import ScrollList from '@/components/ScrollList.vue'
import InputNumber from '@/components/InputNumber.vue'
import { useSelectedList } from '@/composables/useSelectedList'
import { useDragAndDrop } from '@/composables/useDragAndDrop'

const { list, pendingList, nextPage, hasMore, listLoader, searchId } = useSelectedList()

const dragAndDrop = useDragAndDrop()

onMounted(() => {
  document.addEventListener('mouseup', onDragEnd)
})

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', onDragEnd)
})

function onMouseMoveOnLi(ev: MouseEvent) {
  //   if (!dragEl.value || !emptyEl.value) return
  //   const el = ev.currentTarget as HTMLElement
  //   const elRect = el.getBoundingClientRect()
  //   const elHeight = elRect.height
  //   const mousePos = ev.pageY - elRect.top
  //   const isOnTop = elHeight / 2 > mousePos
  //   emptyEl.value.remove()
  //   emptyEl.value = createSameEmptyEl(dragEl.value)
  //   if (isOnTop) {
  //     el.before(emptyEl.value)
  //   } else {
  //     el.after(emptyEl.value)
  //   }
  //   overEl.value = el
}

function onDragInit(ev: MouseEvent) {
  const el = ev.target as HTMLElement
  dragAndDrop.init(el, 1)
}

function onDragEnd(ev: DragEvent | MouseEvent) {
  //   if (!dragEl.value) return
  //   console.log(overEl.value)
  //   isMoving.value = false
  //   mouseY.value = 0
  //   dragEl.value.classList.remove('list-item--drag')
  //   dragEl.value = null
  //   overEl.value = null
  //   emptyEl.value?.remove()
}
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
  position: relative;
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

.btn-drag {
  margin: 0;
  padding: 0;
  width: 20px;
  height: 30px;
  display: flex;
  cursor: grab;
  align-items: center;
  justify-content: center;
  border: 1px solid #dfdfdf;
}
</style>
