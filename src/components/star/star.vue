<template>
  <div class="star" :class="starType">
    <span class="starItem" v-for="(itemClass,index) in itemClasses" :class="itemClass" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  props: {
    size: Number,
    score: Number
  },
  // 计算属性值
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2// 0.5倍数的算法
      let hasDecimal = score % 1 !== 0// 不为0则表示有半数
      let integer = Math.floor(score)// 全星数量
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.star
  font-size 0
  .starItem // 定义通用样式
    display inline-block
    background-repeat no-repeat
  &.star-48
    .starItem
      width 20px
      height 20px
      margin-right 22px
      background-size 20px 20px
      &:last-child
        margin-right 0
      &.on // 全星
        bg-image('img/star48_on')
      &.half // 半星
        bg-image('img/star36_half')
      &.off
        bg-image('img/star48_off')
  &.star-36
    .starItem
      width 15px
      height 15px
      margin-right 6px
      background-size 15px 15px
      &:last-child
        margin-right 0
      &.on // 全星
        bg-image('img/star48_on')
      &.half // 半星
        bg-image('img/star36_half')
      &.off
        bg-image('img/star48_off')
  &.star-24
    .starItem
      width 10px
      height 10px
      margin-right 3px
      background-size 10px 10px
      &:last-child
        margin-right 0
      &.on // 全星
        bg-image('img/star48_on')
      &.half // 半星
        bg-image('img/star36_half')
      &.off
        bg-image('img/star48_off')
</style>
