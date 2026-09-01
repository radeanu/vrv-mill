<template>
  <input
    ref="inputRef"
    type="number"
    :name="name"
    v-model="inputVal"
    :placeholder="placeholder"
    :disabled="disabled"
    autocomplete="off"
    class="mr-49 h-full w-full rounded-md placeholder-grey-500 focus:outline-none"
    @keydown="filterNumericKeys"
    @blur="$emit('blur')"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, watch } from 'vue'

import { useDebounce } from '@/composables/useDebounce'

export type InputNumber = {
  name: string
  debounce?: number
  disabled?: boolean
  placeholder?: string
}

const $emit = defineEmits<{
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const props = withDefaults(defineProps<InputNumber>(), {
  debounce: 300,
  name: 'number',
  placeholder: '123',
})

const model = defineModel<number>()

const inputVal = ref<number | undefined>()

const hasValue = computed(() => {
  const str = inputVal.value?.toString() ?? ''
  return str.length > 0
})

const handleInput = useDebounce(() => {
  model.value = hasValue.value ? inputVal.value : undefined
}, props.debounce)

watchEffect(() => {
  inputVal.value = model.value
})

watch(inputVal, handleInput)

function filterNumericKeys($event: KeyboardEvent) {
  const invalidChars = ['e', 'E', '+']
  const negative = inputVal.value !== undefined && inputVal?.value < 0

  if (invalidChars.includes($event.key) || (negative && '-' === $event.key)) {
    $event.preventDefault()
  }
}
</script>

<style scoped>
input {
  height: 35px;
  width: 180px;
  padding: 2px 15px;
}
</style>
