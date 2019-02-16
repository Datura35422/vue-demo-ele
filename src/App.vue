<template>
  <div>
    <v-header :seller="seller"></v-header>
    <!-- 此处border-1px作用为缩放 -->
    <div class="tab border-1px">
      <div class="tabItem">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tabItem">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tabItem">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from './components/header/header.vue'
import {urlParse} from './common/js/util'
const ERR_OK = 0

export default{
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })() // 立即执行函数
      }
    }
  },
  created () {
    // 创建完成 vue 实例后即请求接口，将值赋给 seller，继而通过 props将获得值传给子组件
    this.$http.get('/api/seller?id=' + this.seller.id).then(res => {
      // success callback
      console.log(res.data.data)
      if (res.data.errno === ERR_OK) {
        // this.seller = res.data
        this.seller = Object.assign({}, this.seller, res.data.data)
        // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
        // 相当于扩展了this.seller属性
        // this.seller = res.data.data;
        console.log(this.seller.id)
        console.log(this.seller)
      }
    }, res => {
      // error callback
      console.log(res)
    })
  },
  components: {
    'v-header': header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl"

  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tabItem
      flex 1
      text-align center
      & > a
        display block
        font-size 14px
        color rgb(77, 85, 93)
      & .active
        color rgb(240, 20, 20)
</style>
