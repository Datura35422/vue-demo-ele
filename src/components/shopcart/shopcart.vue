<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="contentLeft">
        <div class="logoWrapper">
          <div class="logo" :class="{'highLight':totalCount > 0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="num" v-show="totalCount > 0">
            {{totalCount}}
          </div>
        </div>
        <div class="price" :class="{'highLight':totalPrice > 0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="contentRight" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ballContainer">
      <div v-for="(ball, index) in balls" :key="index">
        <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
          <!--外层做纵向动画-->
          <div class="ball" v-show="ball.show">
            <!--内层做横向动画-->
            <div class="inner innerHook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcartList" v-show="listShow">
        <div class="listHeader">
          <h2 class="title">购物车</h2>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="listContent" ref="listcontent">
          <ul ref="shopList">
            <li class="food" v-for="(food, index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrolWrapper">
                <cartcontrol @add="addFood" :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!--列表背后的蒙版-->
    <transition name="fade">
      <div class="listMask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartcontrol from '../../components/cartcontrol/cartcontrol'

export default {
  props: {
    selectFoods: {
      type: Array, // 如果属性类型是array或object，初始值为函数
      default () {
        return []
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }
      ],
      dropBalls: [], // 已经下落的小球
      fold: true // 购物车详细列表显示是否折叠
    }
  },
  components: {
    cartcontrol
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        // `反引号为es6的字符串扩展
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元`
      } else if (this.totalPrice >= this.minPrice) {
        return `去结算`
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'notEnough'
      } else {
        return 'enough'
      }
    },
    listShow: {
      // 计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。
      // 注意，如果某个依赖 (比如非响应式属性) 在该实例范畴之外，则计算属性是不会被更新的。
      // 空着购物车列表显示隐藏,data 里面的 fold 值一变化，computed 计算属性里的 listShow 方法便会被触发
      get () {
        // 初始化时会进行get操作
        console.log('get,fold', this.fold, 'show', !this.fold)
        return !this.fold
      },
      set () {
        // 在set操作中设置data中的值
        console.log('set,fold', this.fold, 'show', !this.fold)
        let show = !this.fold
        // 列表展示时初始化时better-scroll
        if (show) {
          this.$nextTick(() => {
            // 不存在 better-scroll，进行初始化，存在即调用 refresh方法
            console.log('this.scroll', this.scroll)
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listcontent, {
                click: true
              })
            } else {
              // 若已存在scroll，则刷新
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    }
  },
  methods: {
    drop (el) { // 从父组件接收一个对象
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
          // 找到第一个show为false的就跳出
        }
      }
    },
    beforeEnter (el) {
      // 连续点击，需全部响应
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // 元素相对于视口的距离
          // 通过html函数获取当前元素的位置
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          // v-show将display设置为none，要显示出来则修改display的值
          el.style.display = ''
          // 外部元素偏移量y
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          // 获得内部元素
          let inner = el.getElementsByClassName('innerHook')[0]
          // 内部元素设置x轴偏移量
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter (el, done) {
      /* eslint-disable no-unused-vars */
      // 手动触发浏览器重绘，rf变量不使用
      let rf = el.offsetHeight
      // 重置样式，小球样式位置，置于购物车按钮位置处
      this.$nextTick(() => {
        // 外部元素偏移量y
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        // 获得内部元素
        let inner = el.getElementsByClassName('innerHook')[0]
        // 内部元素设置x轴偏移量
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterEnter (el) {
      // 此钩子重绘后才起作用
      // 此轮动画结束后，将此次的 ball 取出 ，ball状态重置，，el display:none
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        // 手动设置为不可见
        el.style.display = 'none'
      }
    },
    toggleList () {
      // 购物车点击事件，购物车列表来回折叠
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
      console.log('toggleList,fold', this.fold)
      this.listShow = !this.fold
    },
    hideList () {
      this.fold = !this.fold
    },
    addFood (target) {
    // 增加小球动画
      console.log('target', target)
      this.drop(target)
    },
    empty () {
      // 清空时处于展开阶段，fold为false，showList为true，手动设置this.fold
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
      this.fold = !this.fold
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`需支付${this.totalPrice}元`)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.shopcart
  position fixed
  left 0
  bottom 0
  width 100%
  height 48px
  z-index 50
  .content
    display flex
    color rgba(255,255,255,.4)
    background-color #141d27
    .contentLeft
      flex 1
      font-size 0
      .logoWrapper
        position relative
        display inline-block
        vertical-align top
        top -10px
        box-sizing border-box
        width 56px
        height 56px
        margin 0 12px
        padding 6px
        border-radius 50%
        background-color #141d27
        .logo
          width 100%
          height 100%
          text-align center
          border-radius 50%
          background-color #2b343c
          &.highLight
            color #fff
            background-color rgb(0,160,220)
          .icon-shopping_cart
            line-height 44px
            font-size 24px
        .num
          position absolute
          top 0
          right 0
          height 16px
          width 24px
          line-height 16px
          text-align center
          font-size 9px
          font-weight 700px
          color #fff
          border-radius 16px
          box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
          background-color rgb(240,20,20)
      .price
        display inline-block
        vertical-align top
        box-sizing border-box
        margin-top 12px
        padding-right 12px
        line-height 24px
        font-size 16px
        font-weight 700
        border-right 1px solid rgba(255,255,255,.1)
        &.highLight
          color #fff
      .desc
        display inline-block
        vertical-align top
        margin 12px 0 0 12px
        line-height 24px
        font-size 10px
    .contentRight
      flex 0 0 105px
      width 105px
      .pay
        height 48px
        line-height 48px
        text-align center
        font-weight 700
        font-size 12px
        &.notEnough
          background-color #2b333b
        &.enough
          background-color #00B43C
          color #fff
  .ballContainer
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      transition all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width 16px
        height 16px
        border-radius 50%
        background-color rgb(0, 160, 220)
        transition all .4s linear
  .shopcartList
    position absolute
    left 0
    top 0
    width 100%
    z-index -1
    transform translate3d(0, -100%, 0)
    &.fold-enter-active, &.fold-leave-active
      transition all 0.4s linear
    &.fold-enter, &.fold-leave-active
      transform translate3d(0,0,0)
    .listHeader
      padding 0 18px
      height 40px
      line-height 40px
      background-color #f3f5f7
      border-bottom 1px solid rgba(7,17,27,.1)
      .title
        float left
        font-size 14px
        color rgb(7, 17, 27)
      .empty
        float right
        font-size 12px
        color rgb(0, 160, 220)
    .listContent
      padding 0 18px
      max-height 217px
      overflow hidden
      background-color #fff
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px rgba(7,17,27,0.1)
        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)
        .price
          position absolute
          right 90px
          bottom 14px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontrolWrapper
          position absolute
          right 0
          bottom 6px
  .listMask
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index -2
    -webkit-backdrop-filter blur(10px)
    background-color rgba(7, 17, 27, .6)
    // 进入时动画
    &.fade-enter-active,&.fade-leave
      transition :all 0.5s
    // 离开时动画
    &.fade-enter,&.fade-leave-active
      opacity :0
      background-color :rgba(7,17,27,0)
</style>
