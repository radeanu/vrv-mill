<template>
  <ul>
    <li v-for="item in list" :key="item" class="item">
      <slot :item>#{{ item }}</slot>
    </li>

    <li class="observer" ref="observerEl" />

    <div v-if="loading" class="loader-wrapper">
      <div class="loader" />
    </div>
  </ul>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'

import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const props = defineProps<{
  list: number[]
  page: number
  loading?: boolean
  trackNextPage?: boolean
}>()

const $emit = defineEmits<{
  (e: 'nextPage'): void
}>()

const observerEl = useTemplateRef('observerEl')
const observer = useIntersectionObserver()

watch([observerEl, () => props.trackNextPage], () => {
  if (!observerEl.value || !props.trackNextPage) {
    observer.removeObserver()
    return
  }

  observer.createObserver(
    observerEl.value,
    {
      isIntersecting: {
        handler() {
          $emit('nextPage')
        },
      },
    },
    { threshold: 0.1 },
  )
})
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;
}

.item {
  padding: 14px;
  border-bottom: 1px solid #cacaca;

  &:has(+ .observer) {
    border-bottom: none;
  }
}

.observer {
  height: 20px;
}

.loader-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 9;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
}

.loader {
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 4px solid #0000;
  border-right-color: #8b8b8b;
  position: relative;
  animation: l24 1s infinite linear;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: inherit;
  animation: inherit;
  animation-duration: 2s;
}
.loader:after {
  animation-duration: 4s;
}
@keyframes l24 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
