<template>
  <main>
    <div class="page">
      <LeftSideList />
      <RightSideList />
    </div>
  </main>
</template>

<script setup lang="ts">
import LeftSideList from '@/components/LeftSideList.vue'
import RightSideList from '@/components/RightSideList.vue'
import { useTasksQueue } from './composables/useTasksQueue.ts'

const tasksQueue = useTasksQueue()
tasksQueue.watchForStatuses()
</script>

<style scoped>
main {
  overflow: hidden;
  height: 100dvh;
}

.page {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
}
</style>
