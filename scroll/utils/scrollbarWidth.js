/*
 * @Author: wuxx
 * @Date: 2021-07-30 10:59:08
 * @LastEditTime: 2021-08-12 15:54:40
 * @LastEditors: wuxx
 * @Description:
 * @FilePath: \jydd\components\scroll\utils\scrollbarWidth.js
 */
import Vue from 'vue'
let scrollBarWidth

export default function() {
  if (Vue.prototype.$isServer) return 17
  if (scrollBarWidth !== undefined) return scrollBarWidth

  const outer = document.createElement('div')
  outer.className = 'wp-scrollbar__wrap'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth
  outer.parentNode.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll
  return scrollBarWidth
}
