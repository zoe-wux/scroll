/*
 * @Author: lihang
 * @Date: 2021-01-13 13:43:02
 * @LastEditTime: 2021-01-13 13:46:03
 * @LastEditors: lihang
 * @Description:
 * @FilePath: \sxedu\components\scroll\utils\event.js
 */
let supportsPassive = false
if (process.browser) {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        return (supportsPassive = true)
      },
    })
    typeof window !== 'undefined' && window.addEventListener('test', null, opts)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
}
/**
 *
 * @param {Object} el 事件对象
 * @param {String} event 事件
 * @param {function} fn 回调方法
 * @param {Boolean} passive 是否进行检测
 */
export const addEvent = (el, event, fn, passive = true) => {
  if (el) {
    if (el.addEventListener) {
      el.addEventListener(event, fn, supportsPassive ? { passive } : false)
    } else {
      el.attachEvent('on' + event, fn)
    }
  } else {
    setTimeout(() => {
      addEvent(el, event, fn, passive)
    }, 500)
  }
}

export const removeEvent = (el, event, fn) => {
  if (el) {
    el.removeEventListener(event, fn)
  } else {
    setTimeout(() => {
      el && el.removeEventListener(event, fn)
    }, 500)
  }
}
