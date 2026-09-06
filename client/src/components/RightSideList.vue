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
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import ScrollList from '@/components/ScrollList.vue'
import InputNumber from '@/components/InputNumber.vue'
import { useSelectedList } from '@/composables/useSelectedList'

const { list, pendingList, nextPage, hasMore, listLoader, searchId } = useSelectedList()

const mouseY = ref(0)
const dragElTop = ref(0)
const isMoving = ref(false)
const dragEl = ref<HTMLElement | null>(null)
const emptyEl = ref<HTMLElement | null>(null)
const overEl = shallowRef<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onDragEnd)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onDragEnd)
})

function onMouseMoveOnLi(ev: MouseEvent) {
  if (!dragEl.value || !emptyEl.value) return

  const el = ev.currentTarget as HTMLElement
  const elRect = el.getBoundingClientRect()
  const elHeight = elRect.height
  const mousePos = ev.pageY - elRect.top
  const isOnTop = elHeight / 2 > mousePos

  emptyEl.value.remove()
  emptyEl.value = createSameEmptyEl(dragEl.value)

  if (isOnTop) {
    el.before(emptyEl.value)
  } else {
    el.after(emptyEl.value)
  }

  overEl.value = el
}

function onDragInit(ev: MouseEvent) {
  const el = ev.target as HTMLElement
  const parentEl = el.parentElement
  if (!parentEl) return

  const listEl = parentEl.parentElement
  if (!listEl) return

  dragEl.value = parentEl
  dragEl.value.classList.add('list-item--drag')
  const ulRect = dragEl.value.parentElement!.getBoundingClientRect()

  dragElTop.value = dragEl.value.getBoundingClientRect().top - ulRect.top

  emptyEl.value = createSameEmptyEl(parentEl)

  const nextEl = parentEl.nextSibling
  const prevEl = parentEl.previousSibling

  if (nextEl) {
    nextEl.before(emptyEl.value)
  } else if (prevEl) {
    prevEl.after(emptyEl.value)
  }
}

function onMouseMove(ev: MouseEvent) {
  if (!dragEl.value) return

  const ulRect = dragEl.value.parentElement!.getBoundingClientRect()
  mouseY.value = ev.pageY - ulRect.top - dragElTop.value

  requestTick()
}

function onDragEnd(ev: DragEvent | MouseEvent) {
  if (!dragEl.value) return

  console.log(overEl.value)

  isMoving.value = false
  mouseY.value = 0
  dragEl.value.classList.remove('list-item--drag')
  dragEl.value = null
  overEl.value = null
  emptyEl.value?.remove()
}

function requestTick() {
  if (!isMoving.value) {
    requestAnimationFrame(updatePosition)
    isMoving.value = true
  }
}

function updatePosition() {
  if (!dragEl.value) {
    isMoving.value = false
    return
  }

  const height = dragEl.value.offsetHeight
  const targetY = mouseY.value - height / 2
  dragEl.value.style.transform = `translateY(${targetY}px)`

  isMoving.value = false
}

function createSameEmptyEl(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const newEl = document.createElement('li')

  newEl.style.width = `${rect.width}px`
  newEl.style.height = `${rect.height}px`
  newEl.style.backgroundColor = '#dfdfdf'
  newEl.style.borderBottom = '1px solid #cacaca'
  newEl.style.pointerEvents = 'none'

  return newEl
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

.list-item--drag {
  width: 100%;
  background-color: red;
  z-index: 10;
  will-change: transform;
  position: absolute;
  margin: 0;
  left: 0;
  pointer-events: none;
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
