// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
// app.vue
// import router from './router'

// 导入通用样式
import './common/stylus/index.styl'

import goods from './components/goods/goods'
import seller from './components/seller/seller'
import ratings from './components/ratings/ratings'

// 全局注册
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.productionTip = false

const routes = [
  { path: '/', redirect: '/goods' }, // 默认就跳转此页面
  { path: '/goods', component: goods },
  { path: '/seller', component: seller },
  { path: '/ratings', component: ratings }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active'
})

new Vue({
  template: '<App/>',
  components: { App },
  router: router
}).$mount('#app')// 挂载点

// router.start(app, '#app');
// router.go('/goods')
