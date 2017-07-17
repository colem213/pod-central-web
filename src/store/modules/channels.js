import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  allChannels: state => state.all
}

// actions
const actions = {
  getAllChannels({ commit }) {
    api.getAllChannels().then(channels => {
      commit(types.RECEIVE_CHANNELS, { channels })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_CHANNELS](state, { channels }) {
    state.all = channels
    state.channels = channels.reduce((acc, ch) => {
      acc[ch.id] = ch
      return acc
    }, {})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
