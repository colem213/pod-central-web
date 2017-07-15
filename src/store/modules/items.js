import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  items: state => state.all
}

// actions
const actions = {
  getItemsByChannel({ commit }, id) {
    api.getItemsByChannel(id).then(items => {
      commit(types.RECEIVE_ITEMS, { items })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_ITEMS](state, { items }) {
    state.all = items
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
