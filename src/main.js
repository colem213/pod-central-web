import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import VeeValidate from 'vee-validate'
import App from './App'
import store from './store'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueMaterial)
Vue.use(VeeValidate, { inject: false })

Vue.material.registerTheme({
  header: {
    primary: 'black',
    accent: 'white'
  },
  body: {
    primary: 'black',
    accent: {
      color: 'grey',
      hue: 800
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
