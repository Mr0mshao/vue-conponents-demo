// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
Vue.config.productionTip = false
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: resolve => require(['./views/upload.vue'], resolve)
    },
    {
      path: '/left',
      component: resolve => require(['./views/leftslide.vue'], resolve)
    },
    {
      path: '/loadmore',
      component: resolve => require(['./views/loadmore.vue'], resolve)
    }
  ]
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
