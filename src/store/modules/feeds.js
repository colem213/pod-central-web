import dynDb from '@/api/dynamodb'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  allFeeds: state => state.all
}

// actions
const actions = {
  getAllFeeds({ commit }) {
    dynDb.getAllFeeds().then(feeds => {
      commit(types.RECEIVE_FEEDS, { feeds })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_FEEDS](state, { feeds }) {
    state.all = feeds
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
