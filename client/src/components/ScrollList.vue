<template>
  <section>
    <ul>
      <li v-for="item in list" :key="item" ref="items">
        <slot :item>#{{ item }}</slot>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watchEffect } from 'vue'

import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const props = defineProps<{ list: number[]; offset: number; limit: number }>()

const itemsRef = useTemplateRef('items')
const observer = useIntersectionObserver()

const watchIdx = computed(() => props.offset + props.limit - 5)

watchEffect(() => {
  const last = itemsRef.value?.at(watchIdx.value)

  if (!last) return

  watchForDisplay(last)
})

function watchForDisplay(item: HTMLLIElement) {
  observer.removeObserver()

  observer.createObserver(item, {
    isIntersecting: {
      handler(el) {
        console.log('VISIBLE', el)
      },
    },
    isHidden: {
      handler() {
        console.log('HIDDEN')
      },
    },
  })
}
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;
  height: 100%;
}

li {
  padding: 30px;
  border-bottom: 1px solid #cacaca;

  &:last-of-type {
    border-bottom: 0;
  }
}
</style>
