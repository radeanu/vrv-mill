import { onBeforeUnmount, ref, onMounted, shallowRef, watch } from 'vue'

import { useEdgeAutoScroll } from '@/composables/useEdgeAutoScroll'

export type DropPayload = {
  draggedEl: HTMLElement
  targetEl: HTMLElement
  position: 'before' | 'after'
}

export type DropCallback = (payload: DropPayload) => void

export function useDragAndDrop(onDrop?: DropCallback) {
  const dragEl = shallowRef<HTMLElement | null>(null)
  const overflowEl = shallowRef<HTMLElement | null>(null)
  const placeholderEl = shallowRef<HTMLElement | null>(null)

  const targetDropEl = shallowRef<HTMLElement | null>(null)
  const dropPosition = ref<'before' | 'after'>('before')

  const mouseY = ref(0)
  const dragElTop = ref(0)
  const mouseClientY = ref(0)
  const mouseClientX = ref(0)
  const isMoving = ref(false)

  const edgeAutoScroll = useEdgeAutoScroll()

  watch(overflowEl, () => {
    if (!overflowEl.value) return

    overflowEl.value.addEventListener('scroll', _calcMouseYPos)
  })

  watch(mouseClientY, _calcMouseYPos)

  onMounted(() => {
    document.addEventListener('mousemove', _onMouseMove)
    document.addEventListener('mouseup', _onMouseUp)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mouseup', _onMouseUp)
    document.removeEventListener('mousemove', _onMouseMove)

    reset()
  })

  function _onMouseMove(ev: MouseEvent) {
    if (!dragEl.value || !overflowEl.value) return

    mouseClientY.value = ev.clientY
    mouseClientX.value = ev.clientX
  }

  function _onMouseUp() {
    if (!dragEl.value || !placeholderEl.value) {
      reset()
      return
    }

    placeholderEl.value.before(dragEl.value)

    if (targetDropEl.value && onDrop) {
      onDrop({
        draggedEl: dragEl.value,
        targetEl: targetDropEl.value,
        position: dropPosition.value,
      })
    }

    reset()
  }

  function _calcMouseYPos() {
    if (!dragEl.value || !overflowEl.value) return
    const ofwRect = overflowEl.value.getBoundingClientRect()

    const relativeMouseY = mouseClientY.value - ofwRect.top
    mouseY.value = relativeMouseY + overflowEl.value.scrollTop - dragElTop.value

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

    dragEl.value.style.transform = `translateY(${mouseY.value}px)`
    _movePlaceholder()

    isMoving.value = false
  }

  function _movePlaceholder() {
    if (!dragEl.value || !overflowEl.value || !placeholderEl.value) return

    const targetElement = document.elementFromPoint(
      mouseClientX.value,
      mouseClientY.value,
    ) as HTMLElement | null

    if (!targetElement) return

    const closestItem = targetElement.closest('.list-item') as HTMLElement | null

    if (!closestItem || closestItem === dragEl.value || closestItem === placeholderEl.value) return

    targetDropEl.value = closestItem

    const targetRect = closestItem.getBoundingClientRect()
    const targetCenterY = targetRect.top + targetRect.height / 2

    if (mouseClientY.value < targetCenterY) {
      closestItem.before(placeholderEl.value)
      dropPosition.value = 'before'
    } else {
      closestItem.after(placeholderEl.value)
      dropPosition.value = 'after'
    }
  }

  function _createPlaceholder(el: HTMLElement): HTMLElement {
    const rect = el.getBoundingClientRect()
    const newEl = document.createElement(el.tagName)

    newEl.classList.add('list-placeholder')
    newEl.style.width = `${rect.width}px`
    newEl.style.height = `${rect.height}px`
    newEl.style.backgroundColor = '#dfdfdf'
    newEl.style.borderBottom = '1px solid #cacaca'
    newEl.style.pointerEvents = 'none'

    return newEl
  }

  function _computeDragElStyles() {
    if (!dragEl.value) return

    dragEl.value.style.width = '100%'
    dragEl.value.style.backgroundColor = 'red'
    dragEl.value.style.zIndex = '10'
    dragEl.value.style.willChange = 'transform'
    dragEl.value.style.position = 'absolute'
    dragEl.value.style.margin = '0'
    dragEl.value.style.left = '0'
    dragEl.value.style.top = '0'
    dragEl.value.style.pointerEvents = 'none'
  }

  function _resetDragElStyles() {
    if (!dragEl.value) return

    dragEl.value.style.width = ''
    dragEl.value.style.backgroundColor = ''
    dragEl.value.style.zIndex = ''
    dragEl.value.style.willChange = ''
    dragEl.value.style.position = ''
    dragEl.value.style.margin = ''
    dragEl.value.style.left = ''
    dragEl.value.style.top = ''
    dragEl.value.style.pointerEvents = ''
    dragEl.value.style.transform = ''
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

  function init(ev: MouseEvent, dragElDeep: number) {
    const el = ev.target as HTMLElement
    if (!el) return

    dragEl.value = _findDragEl(el, dragElDeep)
    overflowEl.value = _findOverflowEl(el)

    if (!overflowEl.value || !dragEl.value) return

    const dragRect = dragEl.value.getBoundingClientRect()
    dragElTop.value = ev.clientY - dragRect.top
    mouseY.value = dragEl.value.offsetTop
    mouseClientY.value = ev.clientY
    dragEl.value.style.transform = `translateY(${mouseY.value}px)`

    _computeDragElStyles()
    _addPlaceholder()

    edgeAutoScroll.init(overflowEl)
  }

  function reset() {
    if (overflowEl.value) {
      overflowEl.value.removeEventListener('scroll', _calcMouseYPos)
    }

    _resetDragElStyles()

    if (placeholderEl.value) {
      placeholderEl.value.remove()
      placeholderEl.value = null
    }

    dragEl.value = null
    overflowEl.value = null
    edgeAutoScroll.reset()
  }

  return {
    init,
    reset,
  }
}
