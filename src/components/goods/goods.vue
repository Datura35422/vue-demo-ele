<template>
  <div class="goods">
    <div class="menuWrapper" ref="menuWrapper">
      <ul>
        <li class="menuItem" v-for="(item, index) in goods" :key="index"
            :class="{'current':currentIndex == index}" @click="selectMenu(index,$event)">
          <span class="text">
            <span class="icon" v-show="item.type > 0" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foodsWrapper" ref="foodsWrapper">
      <ul>
        <!-- foodListHook 表示js进行处理的类，并没有实质的css样式，用来获取列表的高度 -->
        <!-- 一类菜品 -->
        <li class="foodsList foodListHook" v-for="(item, index) in goods" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="foodItem border-1px" v-for="(food, index) in item.foods" :key="index" @click="seeFood(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="sellCount">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="newPrice">￥{{food.price}}</span><span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrolWrapper">
                  <!-- add自定义事件用于派发当前点击的dom元素，add为子组件方法，addFood为父组件方法 -->
                  <cartcontrol :food="food" @add="addFood"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></shopcart>
    <food @add="addFood" :food="seeFoodInfo" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../../components/shopcart/shopcart'
import cartcontrol from '../../components/cartcontrol/cartcontrol'
import food from '../../components/food/food'

const ERR_OK = 0

export default {
  props: { // 接受组件传值
    seller: Object
  },
  data () {
    return {
      goods: [], // 商品信息
      listHeight: [], // 存储商品list的高度
      scrollY: 0, // 记录Y轴的变化，跟踪这个变量
      seeFoodInfo: {} // 存储选中的商品
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  methods: {
    // 可被外部调用的方法，正常命名，不可被外部调用的方法 以 _ 开头
    // 子组件派发的事件
    addFood (target) {
      this._drop(target)
    },
    _drop (target) {
      // 在子组件上定义ref属性，通过$refs接口访问到子组件，调用子组件方法将参数传递给子组件
      // 调用 shopcar 组件中的 drop 方法，向其传入当前点击的 dom 对象
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    // bestScroll点击事件和js原生的点击事件重复，会重复响应点击事件
    selectMenu (index, event) {
      if (!event._constructed) { // 自定义的事件属性,没有表示是js原生的点击事件
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('foodListHook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300) // 300为动画时间
    },
    seeFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.seeFoodInfo = food
      // 调用子组件的方法
      this.$refs.food.show()
    },
    // 初始化滚动条
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })

      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true, // 初始化点击事件，否则在该面板上的点击事件无效
        probeType: 3 // 返回实时滚动的位置
      })

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      }) // 监听foodsScroll滚动事件，记录当前滚动位置
    },
    _calculateHeight () {
      // this.$refs.foodsWrapper 已经用ref绑定了父元素的容器，所以直接获取子元素
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('foodListHook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  computed: {
    currentIndex () {
      // 右边菜品与左边菜单联动有1px的差距，边框的差距
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i] - 1
        let height2 = this.listHeight[i + 1] - 1
        // 当滑动到该区域，左侧同时响应到对应的位置，同时当i为最后一个元素时，height2为undefined，需要判断height2的真假
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => { // 遍历goods的每一个分类
        good.foods.forEach((food) => { // 遍历good中的每一个food
          if (food.count) { // 子组件对购物车中的food添加了count属性
            foods.push(food)
          }
        })
      })
      console.log(foods)
      return foods
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then(res => {
      // success callback
      res = res.body
      console.log(res)
      if (res.errno === ERR_OK) {
        this.goods = res.data
        // 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        // 调用之后重绘DOM高度
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    }, res => {
      // error callback
      console.log(res)
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.goods
  /* 将视口撑开，以便于内容大于父组件时，显示滑动 */
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menuWrapper
    /*自适应布局 左侧不随屏幕变化，右侧随屏幕变化*/
    flex 0 0 80px /*等分 缩放 占位*/
    width 80px
    background-color #f3f5f7
    .menuItem
      display table
      width 56px
      height 54px
      padding 0 12px
      &.current
        position relative
        margin-top -1px
        z-index 10
        font-weight 700
        background-color #fff
        .text
          border-none()
      .icon
        display inline-block
        width 12px
        height 12px
        vertical-align top
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
          bg-image('img/decrease_3')
        &.discount
          bg-image('img/discount_3')
        &.guarantee
          bg-image('img/guarantee_3')
        &.invoice
          bg-image('img/invoice_3')
        &.special
          bg-image('img/special_3')
      .text
        /*垂直居中*/
        display table-cell
        vertical-align middle
        width 56px
        line-height 14px
        font-size 12px
        border-1px(rgba(7, 17, 27 0.1))
  .foodsWrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      font-size 12px
      color rgb(147, 153, 159)
      border-left 2px solid #d9dde1
      background-color #f3f5f7
    .foodItem
      display flex
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27 0.1))
      &:last-child
        border-none()
        /*左侧的icon图片宽度固定，右侧自适应*/
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
        .desc
          margin-bottom 8px
          line-height 12px
        .extra
          .sellCount
            margin-right 12px
        .price
          line-height 24px
          font-weight 700
          .newPrice
            font-size 14px
            color rgb(240, 20, 20)
          .oldPrice
            margin-left 8px
            text-decoration line-through
            font-weight normal
            font-size 10px
            color rgb(147, 153, 159)
        .cartcontrolWrapper
          position absolute
          right 0
          bottom 12px
</style>
