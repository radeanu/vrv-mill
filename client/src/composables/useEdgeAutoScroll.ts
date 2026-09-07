import {
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  watchEffect,
  type MaybeRefOrGetter,
} from 'vue'

export function useEdgeAutoScroll() {
  const elTop = ref(0)
  const scrollY = ref(0)
  const elHeight = ref(0)
  const enabled = ref(false)
  const mustScroll = ref(false)
  const scrolling = ref(false)

  const ovrEl = shallowRef<HTMLElement | null>(null)

  onMounted(() => {
    document.addEventListener('mousemove', _onMouseMove)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', _onMouseMove)
  })

  watchEffect(() => {
    setInterval(() => {
      if (!ovrEl.value || !mustScroll.value) return

      ovrEl.value.scrollTop += 4
    }, 10)
  })

  function _onMouseMove(ev: MouseEvent) {
    if (!ovrEl.value) return
    scrollY.value = ev.pageY - elTop.value

    if (scrollY.value > elHeight.value) {
      mustScroll.value = true
    } else {
      mustScroll.value = false
    }
  }

  function init(el: MaybeRefOrGetter<HTMLElement | null>) {
    ovrEl.value = toValue(el)
    if (!ovrEl.value) return

    const elRect = ovrEl.value.getBoundingClientRect()
    elHeight.value = elRect.height
    elTop.value = elRect.top
  }

  return {
    init,
    enabled,
  }
}
