import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import channels from '@/store/modules/channels'
import items from '@/store/modules/items'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    channels,
    items
  },
  strict: process.env.NODE_ENV !== 'production'
})
