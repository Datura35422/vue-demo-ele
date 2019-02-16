<template>
  <div class="seller" ref="seller">
    <div class="sellerContent">
      <div class="overview">
        <h2 class="title">{{seller.name}}</h2>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="title">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="title">商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2 class="title">平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <div class="contentWrapper">
          <p>{{seller.bulletin}}</p>
        </div>
        <ul class="supports" v-if="seller.supports">
          <li class="supportItem" v-for="(support,index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="picWrapper" ref="picWrapper">
          <ul class="picList" ref="picList">
            <li class="picItem" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90" />
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h2 class="title">商家信息</h2>
        <ul>
          <li class="infoItem" v-for="(info, index) in seller.infos" :key="index">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import star from '../../components/star/star'
import split from '../../components/split/split'
import {saveToLocal, loadFromLocal} from '../../common/js/store'
export default {
  props: {
    seller: Object
  },
  components: {
    star,
    split
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  // 当dom渲染完毕之后，vm.$el替换了el之后运行
  // mounted方法运行时，数据异步加载还未完成，需要使用watch进行监听
  mounted () {
    // console.log("seller", this.seller) // 此时数据还未准备完毕
    this._initScroll()
    this._initPicScroll()
  },
  // watch监听数据对象的变化
  // 必须等到seller数据，异步加载完成后，才能执行 _initPicScroll 方法，将其方法执行放在 watch 对象中，
  // 当观测到 seller 数据 ，或得到之后，执行 _initPicScroll 方法
  watch: {
    // 当 watch 到 seller 生成时 就可以执行 _initPicScroll方法
    'seller' () { // 数据异步加载完成之后重新初始化scroll
      this.$nextTick(() => {
        this._initScroll()
        this._initPicScroll()
      })
    }
  },
  data () {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  methods: {
    toggleFavorite (event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
      console.log(window.localStorage)
    },
    _initScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    },
    _initPicScroll () {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (this.seller.pics.length) * (picWidth + margin) - margin
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true, // 横向滑动
              eventPassthrough: 'vertical'
            })
          } else {
            this.picScroll.refresh()
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.seller
  position absolute
  left 0
  bottom 0
  top 174px
  width 100%
  overflow hidden
  .sellerContent
    .overview
      position relative
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7, 17, 27)
      .desc
        padding 8px 0  18px 0
        font-size 0
        border-1px(rgba(7, 17, 27, .1))
        .star
          display inline-block
          vertical-align top
          margin-right 8px
        .text
          display inline-block
          vertical-align top
          margin-right 12px
          line-height 18px
          font-size 10px
          color rgb(77, 85, 93)
          &:last-child
            margin 0
      .remark
        display flex
        margin-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid #eee
          &:last-child
            border none
          .title
            margin-bottom 4px
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7, 17, 27)
            .stress
              font-size 24px
      .favorite
        position absolute
        top 18px
        right 18px
        width 50px
        text-align center
        .icon-favorite
          display block
          margin-bottom 2px
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color rgb(240, 20, 20)
        .text
          line-height 10px
          font-size 10px
          color rgb(77, 85, 93)
    .bulletin
      padding 18px 18px 0
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        font-weight 400
        color rgb(7, 17, 27)
      .contentWrapper
        padding 0 12px 16px
        border-1px(rgba(7, 17, 27, .1))
        p
          line-height 24px
          font-size 12px
          color rgb(240, 20, 20)
      .supports
        .supportItem
          padding 16px 12px
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image('img/decrease_4')
            &.discount
              bg-image('img/discount_4')
            &.guarantee
              bg-image('img/guarantee_4')
            &.invoice
              bg-image('img/invoice_4')
            &.special
              bg-image('img/special_4')
          .text
            vertical-align top
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
    .pics
      padding 18px
      .title
        margin-bottom 12px
        line-height 14px
        font-size 14px
        font-weight 400
        color rgb(7, 17, 27)
      .picWrapper
        width 100%
        overflow hidden
        white-space nowrap
        .picList
          font-size 0
          .picItem
            display inline-block
            margin-right 6px
            width 120px
            height 90px
          &:last-child
            margin 0
    .info
      padding 18px 18px 0
      .title
        margin-bottom 12px
        line-height 14px
        font-size 14px
        font-weight 400
        color rgb(7, 17, 27)
        border-1px(rgbs(7, 17, 27, .1))
      .infoItem
        padding 16px 12px
        line-height 16px
        font-size 12px
        color rgb(7, 17, 27)
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
</style>
