<template>
  <div
    :class="['wp-scrollbar__bar', 'is-' + bar.key]"
    @mousedown="clickTrackHandler"
  >
    <div
      ref="thumb"
      :style="thumbStyle"
      @mousedown="clickThumbHandler"
      class="wp-scrollbar__thumb"
    ></div>
  </div>
</template>
<script>
import { addEvent, removeEvent } from './utils/event'
import { renderThumbStyle, BAR_MAP } from './utils/scrollbar'

/* istanbul ignore next */
export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal']
    },
    wrap() {
      return this.$parent.wrap
    },
    thumbStyle() {
      return renderThumbStyle({
        size: this.size,
        move: this.move,
        bar: this.bar
      })
    }
  },

  destroyed() {
    removeEvent(document, 'mouseup', this.mouseUpDocumentHandler)
  },
  methods: {
    clickThumbHandler(e) {
      this.startDrag(e)
      this[this.bar.axis] =
        e.currentTarget[this.bar.offset] -
        (e[this.bar.client] -
          e.currentTarget.getBoundingClientRect()[this.bar.direction])
    },

    clickTrackHandler(e) {
      const offset = Math.abs(
        e.target.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]
      )
      const thumbHalf = this.$refs.thumb[this.bar.offset] / 2
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100) / this.$el[this.bar.offset]

      this.wrap[this.bar.scroll] =
        (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },

    startDrag(e) {
      e.stopImmediatePropagation()
      this.cursorDown = true
      addEvent(document, 'mousemove', this.mouseMoveDocumentHandler)
      addEvent(document, 'mouseup', this.mouseUpDocumentHandler)
      document.onselectstart = () => false
    },

    mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return
      const prevPage = this[this.bar.axis]

      if (!prevPage) return

      const offset =
        (this.$el.getBoundingClientRect()[this.bar.direction] -
          e[this.bar.client]) *
        -1
      const thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / this.$el[this.bar.offset]

      this.wrap[this.bar.scroll] =
        (thumbPositionPercentage * this.wrap[this.bar.scrollSize]) / 100
    },

    mouseUpDocumentHandler() {
      this.cursorDown = false
      this[this.bar.axis] = 0
      removeEvent(document, 'mousemove', this.mouseMoveDocumentHandler)
      document.onselectstart = null
    }
  }
}
</script>
