// 浏览器定位
let getMyLocation = function () {
  let s = ''
  if (!navigator.geolocation) {
    s = '抱歉，您的浏览器暂不支持定位'
    return s
  }
  /**
  enableHighAccuracy：如果设为true，就要求客户端提供更精确的位置信息，这会导致更长的定位时间和更大的耗电，默认设为false。
  Timeout：等待客户端做出回应的最大毫秒数，默认值为Infinity（无限）。
  maximumAge：客户端可以使用缓存数据的最大毫秒数。如果设为0，客户端不读取缓存；如果设为infinity，客户端只读取缓存。
  */
  const locationOptions = {
    enableHeightAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }
  function success (event) {
    console.log(event.coords.latitude + ', ' + event.coords.longitude)
    return event.coords.latitude + ', ' + event.coords.longitude
  }
  function errorFn (event) {
    console.log('Error code ' + event.code + '.' + event.message)
    return 'Error code ' + event.code + '.' + event.message
  }
  return navigator.geolocation.getCurrentPosition(success, errorFn, locationOptions)
}
// 去掉字符串空格，默认去掉前后空格，type：1去掉所有空格，3前空格，4空格
let trim = function (str, type) {
  switch (type) {
    case 1:return str.replace(/\s+/g, '')
    case 3:return str.replace(/(^\s*)/g, '')
    case 4:return str.replace(/(\s*$)/g, '')
    default:return str.replace(/(^\s*)|(\s*$)/g, '')
  }
}
// 随机生成字符串, count范围0-36
let randomString = function (n) {
  let str = 'abcdefghijklmnopqrstuvwxyz9876543210ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let temp = ''
  let i = 0
  let l = str.length
  for (i; i < n; i++) {
    temp += str.charAt(Math.floor(Math.random() * l))
  }
  return temp
}
// 获取URL参数
let getUrlParams = function (url) {
  url = url || window.location.href
  let _pa = url.substring(url.indexOf('?') + 1)
  let _arrS = _pa.split('&')
  let _rs = {}
  let _len = _arrS.length
  for (let i = 0; i < _len; i++) {
    let pos = _arrS[i].indexOf('=')
    if (pos === -1) { continue }
    let name = _arrS[i].substring(0, pos)
    let value = window.decodeURIComponent(_arrS[i].substring(pos + 1))
    _rs[name] = value
  }
  return _rs
}
// 数组快速排序
let quickSort = function (arr) {
  if (arr.length <= 1) { return arr };// 注意不要写arr===[] 永远都是false
  var pivotIndex = Math.floor(arr.length / 2)
  var pivot = arr.splice(pivotIndex, 1)[0] // 数组被切掉了pivot
  var left = []
  var right = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right))
}
// 数组选择排序
let selectSort = function (arr) {
  if (arr.length <= 1) { return arr }
  let len = arr.length
  let tmp
  let pivot
  for (let i = 0; i < len - 1; i++) {
    pivot = i
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[pivot]) {
        pivot = j
      }
    }
    tmp = arr[i]
    arr[i] = arr[pivot]
    arr[pivot] = tmp
  }
  tmp = pivot = null
  return arr
}
// 冒泡排序
let bubbleSort = function (arr) {
  if (arr.length <= 1) { return arr }
  let tmp
  let len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[i] < arr[j]) {
        tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
      }
    }
  }
  tmp = len = null
  return arr
}
// 冒泡排序
// 冒泡排序
// 冒泡排序
// 冒泡排序
// 冒泡排序
// 十六进制颜色
let randomColor = function () {
  return '#' + Math.random().toString(16).substring(2).substr(0, 6)
}
// 清空对象中为null 的属性
let objFilter = function (obj) {}
export {
getMyLocation,
getUrlParams,
bubbleSort,
quickSort,
selectSort,
randomColor,
randomString,
trim,
objFilter
}
