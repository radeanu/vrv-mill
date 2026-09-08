import { onBeforeUnmount, onMounted, ref, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'

export function useEdgeAutoScroll(edgeSize = 40) {
  const elTop = ref(0)
  const elHeight = ref(0)
  const scrollSpeed = ref(0)
  const enabled = ref(false)

  const ovrEl = shallowRef<HTMLElement | null>(null)
  let animationFrameId: number | null = null

  onMounted(() => {
    document.addEventListener('mousemove', _onMouseMove)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', _onMouseMove)
    reset()
  })

  function _onMouseMove(ev: MouseEvent) {
    if (!ovrEl.value) return

    const relativeY = ev.clientY - elTop.value

    if (relativeY > elHeight.value - edgeSize) {
      scrollSpeed.value = 5
      _startScrollLoop()
    } else if (relativeY < edgeSize) {
      scrollSpeed.value = -5
      _startScrollLoop()
    } else {
      scrollSpeed.value = 0
      _stopScrollLoop()
    }
  }

  function _startScrollLoop() {
    if (animationFrameId) return

    const loop = () => {
      if (!ovrEl.value || scrollSpeed.value === 0) {
        _stopScrollLoop()
        return
      }

      ovrEl.value.scrollTop += scrollSpeed.value
      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)
  }

  function _stopScrollLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  function init(el: MaybeRefOrGetter<HTMLElement | null>) {
    ovrEl.value = toValue(el)
    if (!ovrEl.value) return

    const elRect = ovrEl.value.getBoundingClientRect()
    elHeight.value = elRect.height
    elTop.value = elRect.top
  }

  function reset() {
    _stopScrollLoop()
    ovrEl.value = null
    scrollSpeed.value = 0
  }

  return {
    init,
    reset,
    enabled,
  }
}
