import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  items: {}
}

// getters
const getters = {
  allItems: state => { return Object.keys(state.items).map(key => state.items[key]) },
  getItem: state => (id) => {
    return state.items[id]
  }
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
    state.items = {
      ...state.items,
      ...items.reduce((acc, ch) => {
        acc[ch.id] = ch
        return acc
      }, {})
    }
  },
  [types.ERASE_ITEMS](state) {
    state.items = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
