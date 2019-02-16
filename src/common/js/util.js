/**
 * 解析URL参数
 * @example ?id=12345&a=b
 * @return Object {id:12345, a:b}
 */
export function urlParse () {
  let url = window.location.search // 获取到url上携带的参数
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // [?id=12345, &a=b]
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=') // [id, 12345]
      let key = decodeURIComponent(tempArr[0]) // decodeURIComponent对编码后的URI进行解码
      let value = decodeURIComponent(tempArr[1])
      obj[key] = value
    })
  }
  return obj
}
