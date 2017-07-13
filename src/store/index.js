import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import feeds from '@/store/modules/feeds'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    feeds
  },
  strict: process.env.NODE_ENV !== 'production'
})
