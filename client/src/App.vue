<template>
  <div class="page">
    <header>page</header>

    <main>
      <LeftSideList class="list" />
      <RightSideList class="list" />
    </main>
  </div>
</template>

<script setup lang="ts">
import LeftSideList from '@/components/LeftSideList.vue'
import RightSideList from '@/components/RightSideList.vue'
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100dvh;
}

header {
  padding: 20px;
}

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  overflow: hidden;
  padding: 20px;
}

.list {
  height: 85dvh;
}
</style>
