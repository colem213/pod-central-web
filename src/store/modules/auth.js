import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  auth: {
    user: {
      username: null
    },
    mustConfirm: null,
    isAnonymous: true,
    isAuthenticated: false
  }
}

// getters
const getters = {
  user: state => state.auth.user,
  isAnonymous: state => state.auth.isAnonymous,
  mustConfirm: state => state.auth.mustConfirm,
  isAuthenticated: state => state.auth.isAuthenticated
}

// actions
const actions = {
  signUp({ commit, dispatch }, form) {
    api.signUp(form).then(auth => {
      commit(types.RECEIVE_AUTH, auth)
    })
  },
  signIn({ commit }, form) {
    api.signIn(form).then(auth => {
      commit(types.RECEIVE_AUTH, auth)
    }).catch(err => {
      console.log(JSON.stringify(err))
      commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
    })
  },
  getCurrentUser({ commit }) {
    api.getCurrentUser().then(user => {
      let data = { user }
      commit(types.RECEIVE_AUTH, { data })
    })
  },
  confirmCode({ commit }, form) {

  }
}

// mutations
const mutations = {
  [types.RECEIVE_AUTH](state, auth) {
    console.log(auth)
    state.auth = { ...state.auth, ...auth }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
