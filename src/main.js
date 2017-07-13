import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueMaterial)

Vue.material.registerTheme({
  header: {
    primary: 'black',
    accent: 'white'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
