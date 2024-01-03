// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
import axios from 'axios'
import { menuHeader, menuAside } from '@/menu'
// import { menuHeader } from '@/menu'
import { frameInRoutes } from '@/router/routes'
import VCharts from 'v-charts'
// import VueSocketIO from 'vue-socket.io'
// import SocketIO from 'socket.io-client'

// 核心插件
Vue.prototype.axios = axios
Vue.use(d2Admin)
Vue.use(VCharts)

// const options = { path: '/demo/' }
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: SocketIO('http://192.168.0.41:5000', options),
//   vuex: {
//     store,
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   }
// })
// )

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: SocketIO('http://192.168.0.41:5000'),
//   vuex: {
//     store,
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   }
// })
// )

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created() {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    // this.$store.commit('d2admin/menu/asideSet', menuAside)
    this.$store.commit('d2admin/menu/asideSet', menuAside)
    this.$store.dispatch('d2admin/menu/asideCollapseSet', false)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted() {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  }
}).$mount('#app')
