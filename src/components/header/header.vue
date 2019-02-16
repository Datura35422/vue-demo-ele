<template>
  <div class="header">
    <div class="contentWrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.delivertTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supportCount" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletinWrapper">
      <span class="bulletinTitle"></span>
      <span class="bulletinText">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img width="100%" :src="seller.avatar">
    </div>
    <!-- sticky footer布局 transitions属性控制渐变动画实现动效 -->
    <transition name="fade" >
      <div class="detail" v-show="detailShow">
        <div class="detailWrapper clearfix">
          <div class="detailMain">
            <h1 class="name">{{seller.name}}</h1>
            <div class="starWrapper">
              <!-- :size和:score给star控件传递了参数 -->
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="support" v-if="seller.supports">
              <li class="supportItem" v-for="(item, index) in seller.supports" :key="index">
                <!-- seller.support[$index].type == item.type -->
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">
                {{seller.bulletin}}
              </p>
            </div>
          </div>
        </div>
        <div class="detailClose" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>

  </div>
</template>

<script type="text/ecmascript-6">
import star from '../../components/star/star'

export default {
  // 接受传递过来的数据
  props: {
    seller: Object
  },
  data () {
    return {
      detailShow: false
    }
  },
  // hooks
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    star // 注册组件
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.header
  position relative
  color #fff
  background rgba(7, 17, 27, 0.5)
  overflow hidden
  .contentWrapper
    position relative
    padding 24px 12px 18px 24px
    font-size 0
    .avatar
      display inline-block
      vertical-align top
      img
       border-radius 2px
    .content
      display inline-block
      margin-left 16px
      font-size 14px
      .title
        margin 2px 0 8px 0
        .brand
          display inline-block
          vertical-align top
          width 30px
          height 18px
          bg-image('img/brand')
          background-size 30px 18px
          background-repeat no-repeat
        .name
          margin-left 6px
          line-height 18px
          font-size 16px
      .description
        line-height 12px
        font-size 12px
      .support
        margin 10px 0 2px 0
        line-height 12px
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('img/decrease_1')
          &.discount
            bg-image('img/discount_1')
          &.guarantee
            bg-image('img/guarantee_1')
          &.invoice
            bg-image('img/invoice_1')
          &.special
            bg-image('img/special_1')
        .text
          vertical-align top
          line-height 12px
          font-size 10px
    .supportCount
      position absolute
      right 12px
      bottom 14px
      padding 0 8px
      height 24px
      line-height 24px
      border-radius 14px
      background-color rgba(0, 0, 0, .2)
      .count
        vertical-align top
        font-size 10px
      .icon-keyboard_arrow_right
        margin-left 2px
        line-height 24px
        font-size 10px
  .bulletinWrapper
    position relative
    padding 0 22px 0 10px
    height 28px
    line-height 28px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    background-color rgba(7, 17, 27, .2)
    .bulletinTitle
      display: inline-block
      vertical-align top
      margin-top 8px
      width 22px
      height 12px
      bg-image('img/bulletin')
      background-size 22px 12px
      background-repeat no-repeat
    .bulletinText
      vertical-align top
      margin 0 4px
      font-size 10px
    .icon-keyboard_arrow_right
      position absolute
      right 12px
      line-height 28px
      font-size 10px
  .background
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index -1
    filter blur(10px)
  .detail
    position fixed
    z-index 100
    top 0
    left 0
    width 100%
    height 100%
    overflow hidden
    background-color rgba(7, 17, 27, .8)
    &.fade-enter-active, &.fade-leave-active
      transition all .5s
      background-color rgba(7, 17, 27, .8)
    &.fade-enter, &.fade-leave-to
      opacity 0
      background-color rgba(7, 17, 27, 0)
    .detailWrapper
      min-height 100%
      width 100%
      .detailMain
        margin-top 64px
        padding-bottom 64px
        .name
          line-height 16px
          font-size 16px
          font-weight 700
          text-align center
        .starWrapper
          margin-top 18px
          padding 2px 0
          text-align center
        .title
          display flex
          width 80%
          margin 28px auto 24px auto
          .line
            flex 1
            position relative
            top -6px
            border-bottom 1px solid rgba(255, 255, 255, 0.2)
          .text
            padding 0 12px
            font-weight 700
            font-size 14px
        .support
          width 80%
          margin 0 auto
          .supportItem
            padding 0 12px
            margin-bottom 12px
            font-size 0
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              width 16px
              height 16px
              vertical-align top
              margin-right 6px
              background-size 16px 16px
              background-repeat no-repeat
              &.decrease
                bg-image('img/decrease_2')
              &.discount
                bg-image('img/discount_2')
              &.guarantee
                bg-image('img/guarantee_2')
              &.invoice
                bg-image('img/invoice_2')
              &.special
                bg-image('img/special_2')
            .text
              line-height 16px
              font-size 12px
              font-weight 200
        .bulletin
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            line-height 24px
            font-size 12px
    .detailClose
      position relative
      width 32px
      height 32px
      margin -64px auto 0 auto
      clear both
      font-size 32px
</style>
