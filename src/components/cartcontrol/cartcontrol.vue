<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cartDecrease" v-show="food.count > 0"
           @click.stop.prevent="decreaseCart($event)">
          <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cartCount" v-show="food.count > 0">{{food.count}}</div>
    <div class="cartAdd icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  props: {
    food: Object
  },
  created () {
    // console.log(this.food)
  },
  methods: {
    addCart (event) {
      if (!event._constructed) { // 自定义的事件属性,没有表示是js原生的点击事件
        return
      }
      if (!this.food.count) {
      //  this.food.count = 1 想要检测到该属性的变化，需要调用vue.set接口
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 自定义事件,向父组件派发事件
      this.$emit('add', event.target)
    },
    decreaseCart (event) {
      if (!event._constructed) { // 自定义的事件属性,没有表示是js原生的点击事件
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size 0
  .cartDecrease
    display inline-block
    vertical-align top
    padding 6px
    transition all .4s linear
    transform translate3d(0, 0, 0)
    opacity 1
    .inner
      display inline-block
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
      transition all 0.4s linear
      transform rotate(0deg)
    &.move-enter, &.move-leave-to
      transition all .4s linear
      transform translate3d(24px, 0, 0)
      opacity 0
      .inner
        transform rotate(180deg)
  .cartCount
    display inline-block
    vertical-align top
    padding-top 6px
    width 12px
    line-height 24px
    font-size 10px
    text-align center
    color rgb(147, 153, 159)
  .cartAdd
    display inline-block
    vertical-align top
    padding 6px
    line-height 24px
    font-size 24px
    color rgb(0, 160, 220)
</style>
