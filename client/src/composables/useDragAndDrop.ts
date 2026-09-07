import {
  onBeforeUnmount,
  ref,
  onMounted,
  shallowRef,
  toValue,
  type MaybeRefOrGetter,
  watch,
} from 'vue'
import { useEdgeAutoScroll } from '@/composables/useEdgeAutoScroll'

export function useDragAndDrop() {
  const dragEl = shallowRef<HTMLElement | null>(null)
  const overflowEl = shallowRef<HTMLElement | null>(null)
  const placeholderEl = shallowRef<HTMLElement | null>(null)
  const dragElStyleBefore = ref<{ [k in keyof CSSStyleProperties]?: string }>()

  const mouseY = ref(0)
  const mousePageY = ref(0)
  const dragElTop = ref(0)
  const isMoving = ref(false)

  const edgeAutoScroll = useEdgeAutoScroll()

  watch(overflowEl, () => {
    if (!overflowEl.value) return

    overflowEl.value.addEventListener('scroll', _calcMouseYPos)
  })

  watch(mousePageY, _calcMouseYPos)

  onMounted(() => {
    document.addEventListener('mousemove', _onMouseMove)
    document.addEventListener('mouseup', _onMouseUp)
  })

  onBeforeUnmount(() => {
    reset()
    document.removeEventListener('mousemove', _onMouseMove)
    document.removeEventListener('mouseup', _onMouseUp)
  })

  function _onMouseMove(ev: MouseEvent) {
    if (!dragEl.value || !overflowEl.value) return

    mousePageY.value = ev.pageY
  }

  function _onMouseUp() {}

  function _calcMouseYPos() {
    if (!dragEl.value || !overflowEl.value) return
    const ofwRect = overflowEl.value.getBoundingClientRect()

    // mouseY.value = mousePageY.value - ofwRect.top - dragElTop.value
    mouseY.value = mousePageY.value - ofwRect.top - dragElTop.value + overflowEl.value.scrollTop
    console.log(mouseY.value, overflowEl.value.scrollTop)

    if (!isMoving.value) {
      requestAnimationFrame(_updatePosition)
      isMoving.value = true
    }
  }

  function _updatePosition() {
    if (!dragEl.value) {
      isMoving.value = false
      return
    }

    const height = dragEl.value.offsetHeight
    const targetY = mouseY.value - height / 2
    dragEl.value.style.transform = `translateY(${targetY}px)`

    isMoving.value = false
  }

  function _createPlaceholder(el: HTMLElement): HTMLElement {
    const rect = el.getBoundingClientRect()
    const newEl = document.createElement(el.tagName)

    newEl.style.width = `${rect.width}px`
    newEl.style.height = `${rect.height}px`
    newEl.style.backgroundColor = '#dfdfdf'
    newEl.style.borderBottom = '1px solid #cacaca'
    newEl.style.pointerEvents = 'none'

    return newEl
  }

  function _computeDragElStyles() {
    if (!dragEl.value) return

    const cStyle = window.getComputedStyle(dragEl.value)

    dragElStyleBefore.value = {
      width: cStyle.width,
      backgroundColor: cStyle.backgroundColor,
      zIndex: cStyle.zIndex,
      willChange: cStyle.willChange,
      position: cStyle.position,
      margin: cStyle.margin,
      left: cStyle.left,
      pointerEvents: cStyle.pointerEvents,
    }

    dragEl.value.style.width = '100%'
    dragEl.value.style.backgroundColor = 'red'
    dragEl.value.style.zIndex = '10'
    dragEl.value.style.willChange = 'transform'
    dragEl.value.style.position = 'absolute'
    dragEl.value.style.margin = '0'
    dragEl.value.style.left = '0'
    dragEl.value.style.pointerEvents = 'none'
  }

  function _resetDragElStyles() {
    if (!dragEl.value || !dragElStyleBefore.value) return

    Object.assign(dragEl.value.style, dragElStyleBefore.value)
  }

  function _addPlaceholder() {
    if (!dragEl.value) return

    const nextEl = dragEl.value.nextSibling
    const prevEl = dragEl.value.previousSibling

    placeholderEl.value = _createPlaceholder(dragEl.value)

    if (nextEl) {
      nextEl.before(placeholderEl.value)
    } else if (prevEl) {
      prevEl.after(placeholderEl.value)
    }
  }

  function _findDragEl(el: HTMLElement, deep: number): HTMLElement | null {
    if (deep === 0) return el

    if (!el.parentElement) return null

    return _findDragEl(el.parentElement, deep - 1)
  }

  function _findOverflowEl(el: HTMLElement): HTMLElement | null {
    const style = window.getComputedStyle(el)
    const scrollableValues = ['auto', 'scroll', 'overlay']
    const isOverflow = scrollableValues.includes(style.overflow)

    if (isOverflow) return el

    return el.parentElement ? _findOverflowEl(el.parentElement) : null
  }

  function init(el: MaybeRefOrGetter<HTMLElement | null>, dragElDeep: number) {
    const elVal = toValue(el)
    if (!elVal) return

    dragEl.value = _findDragEl(elVal, dragElDeep)
    overflowEl.value = _findOverflowEl(elVal)
    _computeDragElStyles()

    if (!overflowEl.value || !dragEl.value) return

    const ovfRect = overflowEl.value.getBoundingClientRect()
    dragElTop.value = dragEl.value.getBoundingClientRect().top - ovfRect.top

    _addPlaceholder()

    edgeAutoScroll.init(overflowEl)
  }

  function reset() {
    dragEl.value = null
    overflowEl.value = null
  }

  return {
    init,
    reset,
  }
}
