import api from '@/api'
import Vue from 'vue'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  items: {},
  itemsByChannel: {},
  lastKeyByChannel: {},
  sortAscByChannel: {},
  loading: false
}

// getters
const getters = {
  getItems: state => channelId => state.itemsByChannel[channelId],
  getItem: state => id => state.items[id],
  areItemsLoading: state => state.loading,
  areAllItemsLoaded: state => channelId => state.lastKeyByChannel[channelId] === true,
  getSortAsc: state => channelId => state.sortAscByChannel[channelId] !== false
}

// actions
const actions = {
  getItemsByChannel({ commit, state, getters }, channelId) {
    if (getters.areAllItemsLoaded(channelId)) return
    commit(types.REQUEST_ITEMS)
    api.getItemsByChannel({
      channelId,
      sortAsc: getters.getSortAsc(channelId),
      lastKey: state.lastKeyByChannel[channelId]
    }).then(rsp => {
      commit(types.RECEIVE_ITEMS, { lastKey: true, ...rsp })
    }).catch(err => {
      commit(types.UPDATE_MESSAGE, {type: 'error', text: err.message})
    })
  },
  itemsToggleSort({ commit, dispatch, getters }, channelId) {
    commit(types.ITEMS_TOGGLE_SORT, {channelId, sortAsc: getters.getSortAsc(channelId)})
    dispatch('getItemsByChannel', channelId)
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
    Vue.set(state.itemsByChannel, channelId, channelItems)
    Vue.set(state.lastKeyByChannel, channelId, lastKey)
  },
  [types.ITEMS_TOGGLE_SORT](state, {channelId, sortAsc}) {
    Vue.set(state.sortAscByChannel, channelId, !sortAsc)
    delete state.itemsByChannel[channelId]
    delete state.lastKeyByChannel[channelId]
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
