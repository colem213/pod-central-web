import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  channels: {}
}

// getters
const getters = {
  allChannels: state => { return Object.keys(state.channels).map(key => state.channels[key]) }
}

// actions
const actions = {
  getAllChannels({ commit }) {
    api.getAllChannels().then(channels => {
      commit(types.RECEIVE_CHANNELS, { channels })
    }).catch(() => {})
  },
  getChannel({ commit }, channelId) {
    api.getChannel(channelId).then(channel => {
      commit(types.RECEIVE_CHANNELS, { channels: [channel] })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_CHANNELS](state, { channels }) {
    state.channels = {
      ...state.channels,
      ...channels.reduce((acc, ch) => {
        acc[ch.id] = ch
        return acc
      }, {})
    }
  },
  [types.ERASE_CHANNELS](state) {
    state.channels = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
