<!--
 * @Author: lihang
 * @Date: 2021-01-13 13:41:31
 * @LastEditTime: 2021-01-24 16:04:48
 * @LastEditors: codesides
 * @Description:
 * @FilePath: \sxedu\components\scroll\index.vue
-->
<template>
  <div class="wp-scrollbar" v-bind="$attrs">
    <template v-if="native">
      <div
        ref="wrap"
        :class="[wrapClass, 'wp-scrollbar__wrap']"
        :style="gutterStyle"
      >
        <div
          ref="resize"
          :class="['wp-scrollbar__view', viewClass]"
          :style="viewStyle"
        >
          <slot></slot>
        </div>
      </div>
    </template>
    <template else>
      <div
        ref="wrap"
        :style="gutterStyle"
        :class="[
          wrapClass,
          'wp-scrollbar__wrap',
          gutter ? '' : 'wp-scrollbar__wrap--hidden-default',
        ]"
      >
        <div
          ref="resize"
          :class="['wp-scrollbar__view', viewClass]"
          :style="viewStyle"
        >
          <slot></slot>
        </div>
      </div>
      <Bar :move="moveX" :size="sizeWidth"></Bar>
      <Bar vertical :move="moveY" :size="sizeHeight"></Bar>
    </template>
  </div>
</template>
<script>
import scrollbarWidth from './utils/scrollbarWidth'
import { addResizeListener, removeResizeListener } from './utils/resizeEvent'
import { addEvent } from './utils/event'
import Bar from './bar'

/* istanbul ignore next */
export default {
  name: 'Scroll',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div',
    },
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      gutter: scrollbarWidth(),
      gutterStyle: {
        marginRight: `-${scrollbarWidth()}px`,
      },
    }
  },
  computed: {
    wrap() {
      return this.$refs.wrap
    },
  },

  mounted() {
    if (this.native) return
    this.$nextTick(this.update)
    !this.noresize && addResizeListener(this.$refs.resize, this.update)
    addEvent(this.$refs.wrap, 'scroll', this.handleScroll)
  },

  beforeDestroy() {
    if (this.native) return
    !this.noresize && removeResizeListener(this.$refs.resize, this.update)
  },
  methods: {
    handleScroll() {
      const wrap = this.wrap

      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth
      this.$nextTick(() => {
        this.$emit('scroll', { moveX: wrap.scrollLeft, moveY: wrap.scrollTop })
      })
    },

    update() {
      const wrap = this.wrap
      if (!wrap) return

      const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
      const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : ''
    },

    scrollTo(x, y) {
      this.$refs.wrap.scrollTo(x, y)
    },
  },
}
</script>

<style lang="less">
.wp-scrollbar {
  overflow: hidden;
  position: relative;

  &:hover,
  &:active,
  &:focus {
    > .wp-scrollbar__bar {
      opacity: 1;
      transition: opacity 340ms ease-out;
    }
  }

  .wp-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    &.wp-scrollbar__wrap--hidden-default {
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
    .wp-scrollbar__view {
      height: 100%;
    }
  }

  .wp-scrollbar__thumb {
    position: relative;
    display: block;
    width: 0;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: rgba(153, 153, 153, 0.3);
    transition: 0.3s background-color;

    &:hover {
      background-color: rgba(153, 153, 153, 0.5);
    }
  }

  .wp-scrollbar__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 2001;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 120ms ease-out;
    &.is-vertical {
      width: 6px;
      top: 2px;
      > div {
        width: 100%;
      }
    }
    &.is-horizontal {
      height: 6px;
      left: 2px;
      > div {
        height: 100%;
      }
    }
  }
}
</style>
