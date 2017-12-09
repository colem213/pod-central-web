import Vue from 'vue'
import VeeValidate from 'vee-validate'
import infiniteScroll from 'vue-infinite-scroll'
import App from './App'
import store from './store'
import router from './router'
import 'bootstrap'
import './sass/custom.scss'

Vue.config.productionTip = false

Vue.use(VeeValidate, { inject: false })
Vue.use(infiniteScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
