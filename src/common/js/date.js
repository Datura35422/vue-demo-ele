// 格式化时间戳
export function formatDate (date, format) {
  if (/(y+)/.test(format)) {
    // RegExp.$1正则表达式匹配到的第一个符合格式的字符串
    // 将年份转换为字符串格式，
    // 年份一般4个字符长度，特殊的2个，进行动态设置
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  // 通过遍历动态格式化
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      let str = o[k] + '' // 类型转为String
      // 如果格式为1个就返回，2个就需要补0
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : addLeftZero(str))
    }
  }
  return format
}

function addLeftZero (str) {
  // 如果字符串长度为1，则从1开始截取，如返回01
  return ('00' + str).substr(str.length)
}
