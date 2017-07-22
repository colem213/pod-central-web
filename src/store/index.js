import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import channels from '@/store/modules/channels'
import items from '@/store/modules/items'
import auth from '@/store/modules/auth'
import message from '@/store/modules/message'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    channels,
    items,
    auth,
    message
  },
  strict: process.env.NODE_ENV !== 'production'
})
