import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import channels from '@/store/modules/channels'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    channels
  },
  strict: process.env.NODE_ENV !== 'production'
})
