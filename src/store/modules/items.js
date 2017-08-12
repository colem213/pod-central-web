import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  items: {},
  itemsByChannel: {},
  lastKeyByChannel: {},
  loading: false
}

// getters
const getters = {
  getItems: state => channelId => state.itemsByChannel[channelId],
  getItem: state => id => state.items[id],
  areItemsLoading: state => state.loading,
  areAllItemsLoaded: state => channelId => state.lastKeyByChannel[channelId] === true
}

// actions
const actions = {
  getItemsByChannel({ commit, state, getters }, id) {
    if (getters.areAllItemsLoaded(id)) return
    commit(types.REQUEST_ITEMS)
    api.getItemsByChannel(id, state.lastKeyByChannel[id]).then(rsp => {
      commit(types.RECEIVE_ITEMS, { lastKey: true, ...rsp })
    }).catch(err => {
      commit(types.UPDATE_MESSAGE, {type: 'error', text: err.message})
    })
  }
}

// mutations
const mutations = {
  [types.REQUEST_ITEMS](state) {
    state.loading = true
  },
  [types.RECEIVE_ITEMS](state, { channelId, items, lastKey }) {
    state.loading = false
    state.items = {
      ...state.items,
      ...items.reduce((acc, item) => {
        acc[item.id] = item
        return acc
      }, {})
    }
    let channelItems = state.itemsByChannel[channelId] || []
    channelItems.push.apply(channelItems, items.map(item => item.id))
    state.itemsByChannel[channelId] = channelItems
    state.lastKeyByChannel[channelId] = lastKey
  },
  [types.ERASE_ITEMS](state) {
    state.items = {}
    state.itemsByChannel = {}
    state.lastKeyByChannel = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
