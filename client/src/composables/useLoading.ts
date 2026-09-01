import { computed, readonly, ref } from 'vue'

export function useLoading() {
  const loading = ref(0)

  const isLoading = computed(() => loading.value > 0)

  function start() {
    loading.value += 1
  }

  function end(timeout = 500) {
    if (loading.value === 0) return

    setTimeout(() => {
      loading.value -= 1
    }, timeout)
  }

  function forceEnd(timeout = 500) {
    setTimeout(() => {
      loading.value = 0
    }, timeout)
  }

  return {
    end,
    start,
    forceEnd,
    isLoading: readonly(isLoading),
  }
}
