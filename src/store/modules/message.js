import * as types from '@/store/mutation-types'

const initialState = {
  type: '',
  text: '',
  vertical: 'top',
  horizontal: 'center',
  duration: 4000
}

// initial state
const state = {
  message: {
    ...initialState
  }
}

// getters
const getters = {
  message: state => state.message
}

// actions
const actions = {
  updateMessage({ commit }, message) {
    commit(types.UPDATE_MESSAGE, message)
  }
}

// mutations
const mutations = {
  [types.UPDATE_MESSAGE](state, message) {
    state.message = { ...initialState, ...message }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
