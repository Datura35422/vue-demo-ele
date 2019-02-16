/**
 * 存入本地缓存
 * @param id
 * @param key
 * @param value
 */
export function saveToLocal (id, key, value) {
  let seller = window.localStorage.__seller__ // 定义一个命名空间
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller) // 转化成js对象
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller) // js对象转化成JSON
}
/**
 * 获取缓存中的数据
 * @param id
 * @param key
 * @param def 如果缓存中没有，返回默认值
 */
export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id] // 转化成js对象
  let ref = seller[key]
  return ref || def
}
