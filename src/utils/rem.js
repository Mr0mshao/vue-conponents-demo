(function (win, doc) {
  let timer = null
  let html = doc.documentElement
  let baseWidth = html.dataset.basewidth * 1 || 750 // 设计稿宽度
  let metaEl = document.querySelector('meta[name="viewport"]')
  let event = 'onorientationchange' in win ? 'orientationchange' : 'resize'
  if (!metaEl) {
    metaEl = document.createElement('meta')
    metaEl.setAttribute('name', 'viewport')
    metaEl.setAttribute('content', 'initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=0')
    html.firstElementChild.appendChild(metaEl)
  }
  function layoutCalc () {
    let width = html.getBoundingClientRect().width
    let ratio = width / baseWidth * 100 // 当前屏幕与基准屏幕的宽度之比
    let devicePixelRatio = window.devicePixelRatio
    let rem = ratio < 100 ? ratio < 50 ? 50 : ratio : 100
    if (!/\.\d+/.test(devicePixelRatio.toString())) {
      html.dataset.dpr = devicePixelRatio
    }
    html.style.fontSize = rem + 'px' // 根绝比值去等比例缩小页面的元素尺寸
    win.px2rem = function (v) {
      return v * 1 / rem
    }
    win.rem2px = function (v) {
      return v * 1 * rem
    }
    win.rem = rem
  }
  function addStyleNode () {
    const str = `html[data-dpr="1"] .dpr-text{font-size:12px;}html[data-dpr="2"] .dpr-text{font-size:24px;}html[data-dpr="3"] .dpr-text{font-size:36px;}`
    var styleNode = document.createElement('style')
    styleNode.type = 'text/css'
    styleNode.innerHTML = str // 在ff中， innerHTML是可读写的，但在ie中，它是只读的
    document.getElementsByTagName('head')[0].appendChild(styleNode)
  }
  win.addEventListener(event, function () {
    clearTimeout(timer)
    timer = setTimeout(layoutCalc, 300)
  }, false)
  win.addEventListener('pageShow', function (e) {
    if (e.persisted) {
      clearTimeout(timer)
      timer = setTimeout(layoutCalc, 300)
    }
  }, false)
  layoutCalc()
  addStyleNode()
}(window, document))
