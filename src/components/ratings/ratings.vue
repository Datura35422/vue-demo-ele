<template>
  <div class="ratings" ref="ratings">
    <div class="ratingsContent">
      <div class="overview">
        <div class="overviewLeft">
          <h2 class="score">{{seller.score}}</h2>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overviewRight">
          <div class="scoreWrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="scoreWrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryWrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @select="selectRating" @onlyContent="toggleContent"
                    :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="ratings"></ratingselect>
      <!-- 评论列表 -->
      <div class="ratingWrapper">
        <ul v-show="ratings && ratings.length">
          <li class="ratingItem" v-for="(rating,index) in ratings" :key="index"
              v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" height="28" width="28">
            </div>
            <div class="content">
              <h2 class="name">{{rating.name}}</h2>
              <div class="starWrapper">
                <star :size="24" :score="rating.score"></star>
                <div class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</div>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(recommend,index) in rating.recommend" :key="index">{{recommend}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
        <div class="noRating" v-show="!ratings || !ratings.length">
          暂无评论
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatDate} from '../../common/js/date'
import BScroll from 'better-scroll'
import star from '../../components/star/star'
import split from '../../components/split/split'
import ratingselect from '../../components/ratingselect/ratingselect'

const ALL = 2
const ERR_OK = 0

export default {
  props: {
    seller: Object
  },
  components: {
    star,
    split,
    ratingselect
  },
  data () {
    return {
      ratings: [],
      selectType: ALL, // 默认选择全部评论
      onlyContent: false
    }
  },
  created () {
    // 获取ratings评论列表
    this.$http.get('/api/ratings').then(res => {
      // success callback
      res = res.body
      console.log(res)
      if (res.errno === ERR_OK) {
        this.ratings = res.data
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        })
      }
    }, res => {
      // error callback
      console.log(res)
    })
  },
  methods: {
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
.ratings
  position absolute
  top 174px
  bottom 0
  left 0
  width 100%
  overflow hidden
  .overview
    display flex
    padding 18px 0
    .overviewLeft
      flex 0 0 137px
      padding 6px 0
      width 137px
      border-right 1px solid rgba(7,17,27,0.1)
      text-align center
      @media only screen and (max-width: 320px)
        flex 0 0 120px
        width 120px
      .score
        margin-bottom 6px
        line-height 28px
        font-size 24px
        color rgb(255, 153, 0)
      .title
        margin-bottom 8px
        line-height 12px
        font-size 12px
        color rgb(7, 17, 27)
      .rank
        line-height 10px
        font-size 10px
        color rgb(147, 153, 159)
    .overviewRight
      flex 1
      padding 6px 0 6px 24px
      @media only screen and (max-width: 320px)
        padding-left 6px
      .scoreWrapper
        margin-bottom 8px
        font-size 0
        .title
          display inline-block
          vertical-align top
          line-height 18px
          font-size 12px
          color rgb(7, 17, 27)
        .star
          display inline-block
          vertical-align top
          margin 0 12px
        .score
          display inline-block
          vertical-align top
          line-height 18px
          font-size 12px
          color rgb(255, 153, 0)
      .deliveryWrapper
        font-size 0
        .title
          line-height 18px
          font-size 12px
          color rgb(7, 17, 27)
        .delivery
          margin-left 12px
          line-height 18px
          font-size 12px
          color rgb(147, 153, 159)
  .ratingWrapper
    padding 0 18px
    .ratingItem
      display flex
      padding 18px 0
      border-1px(rgb(147, 153, 159))
      .avatar
        flex 0 0 28px
        height 28px
        width 28px
        margin-right 12px
        img
          border-radius 50%
      .content
        flex 1
        position relative
        .name
          margin-bottom 4px
          line-height 12px
          font-size 10px
          color rgb(7, 17, 27)
        .starWrapper
          margin-bottom 6px
          font-size 0
          .star
            display inline-block
            vertical-align top
            margin-right 3px
          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147, 153, 259)
        .text
          margin-bottom 8px
          line-height 18px
          font-size 12px
          color rgb(7, 17, 27)
        .recommend
          font-size 0
          .icon-thumb_up, .item
            display inline-block
            vertical-align top
            margin 0 8px 4px 0
            line-height 16px
            font-size 9px
          .icon-thumb_up
            color rgb(0, 160, 220)
          .item
            padding 0 6px
            max-width 70px
            line-height 16px
            color rgb(147, 153, 159)
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            background-color :#fff
            border-radius 1px
            border 1px solid rgba(7, 17, 27, .1)
        .time
          position absolute
          right 0
          top 0
          font-size 10px
          color rgb(7,17,27)
    .noRating
      padding 16px 0
      font-size 12px
      color rgb(147, 153, 159)
</style>
