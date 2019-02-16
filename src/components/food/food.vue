<template>
  <transition name="fly">
    <div class="food" v-show="showFlag" ref="foodContent">
      <div class="foodContent">
        <div class="imageHeader">
          <img :src="food.image" />
          <div class="back" @click="hide($event)">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h2 class="title">{{food.name}}</h2>
          <div class="detail">
            <span class="sellCount">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="new">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrolWrapper" v-show="food.count>0">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click="addFirst($event)">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <div class="title">商品信息</div>
          <div class="text">{{food.info}}</div>
        </div>
        <split></split>
        <div class="rating">
          <h2 class="title">商品评价</h2>
          <ratingselect @select="selectRating" @onlyContent="toggleContent"
                        :selectType="selectType" :onlyContent="onlyContent"
                        :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="ratingWrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="ratingItem" v-show="needShow(rating.rateType, rating.text)"
                  v-for="(rating, item) in food.ratings" :key="item">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" />
                </div>
                <!--自定义过滤器 日期格式化-->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,
                   'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="noRating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
// export function 的方式是需要加{}，可以import多个模块，仅需要{a,b}
import {formatDate} from '../../common/js/date'
// export default 的方式是不用加{}
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import split from '../../components/split/split'
import ratingselect from '../../components/ratingselect/ratingselect'

// 跟踪用户选择的评价类型，将评价内容传递给子组件
// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    food: Object
  },
  data () {
    return {
      showFlag: false,
      selectType: ALL, // 默认选择全部评论
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  methods: {
    // 可被外部调用的方法，正常命名，不可被外部调用的方法 以 _ 开头
    show () {
      this.showFlag = true
      // 当每次被外部组件调用时，组件内的内容可能已经发生改变，因此，需要将数据进行初始化
      this.selectType = ALL
      this.onlyContent = false

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodContent, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide (event) {
      if (!event._constructed) {
        return
      }
      this.showFlag = false
    },
    addFood (target) {
      // 没有传值时默认传输target
      // 向父组件派发事件
      console.log(target)
      // 当前组件必须在父组件引入处，绑定@add="xxx",继而执行 父组件的 xxx 方法
      this.$emit('add', target)
    },
    addFirst (event) {
      if (!event._constructed) {
        return
      }
      console.log('first', event.target)
      // 给父组件派发事件
      this.$emit('add', event.target)
      // Vue.set() 需要导入Vue实例
      this.$set(this.food, 'count', 1)
    },
    // selectRating 方法接收子组件 emit 过来的值，
    // 赋值给 父组件 selectType 然后在通过 props传递给子组件，从而实现改变
    selectRating (type) {
      this.selectType = type
      // 不进行刷新会出现滑动回弹情况
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent (onlyContent) {
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    needShow (type, text) {
      // 没有文本时
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  // 过滤器方法
  filters: {
    formatDate (time) {
      let date = new Date(time)
      // 将formatDate方法抽象出来，封装到js中，方便多次调用
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.food
  position fixed
  top 0
  left 0
  bottom 48px
  width 100%
  z-index 30
  background-color #fff
  &.fly-enter-active, &.fly-leave-active
    transition all .2s linear
  &.fly-enter, &.fly-leave-to
    transform translate3d(100%, 0, 0)
  // 商品详情
  .foodContent
    // 此处为什么要选择注释里这样布局？ ==>因为，防止网络情况不好时，图片加载太慢，无法第一时间撑开高度，导致底部内容跑道上面来
    padding-bottom 100px
    .imageHeader
      position relative
      // 当未知图片宽高时，已知宽为100%，则padding-top的值基于width的值取值，防止布局抖动
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        font-weight 700
        color rgb(7, 17, 27)
      .detail
        margin-bottom 18px
        height 10px
        line-height 10px
        font-size 0
        .sellCount, .rating
          font-size 10px
          color rgb(147, 153, 159)
        .sellCount
          margin-right 12px
      .price
        line-height 24px
        font-weight 700
        .new
          font-size 14px
          color rgb(240, 20, 20)
        .old
          margin-left 8px
          text-decoration line-through
          font-weight normal
          font-size 10px
          color rgb(147, 153, 159)
      .cartcontrolWrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        width 74px
        height 24px
        line-height 24px
        text-align center
        font-size 10px
        color #fff
        border-radius 12px
        background-color rgb(0, 160, 220)
        opacity 1
        // 加入动画,不会立马v-show=false,从而可以获取到元素位置，实现小球动画
        &.fade-enter-active, &.fade-leave-active
          transition all .1s linear
        &.fade-enter, &.fade-leave-text-outline
          opacity 0
          z-index -1
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        padding 0 8px
        line-height 24px
        font-size 12px
        color rgb(77, 85, 93)
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7, 17, 27)
      .ratingWrapper
        padding 0 18px
        .ratingItem
          position relative
          padding 12px 0
          border-1px(rgba(7, 17, 27, .1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
        .noRating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)
</style>
