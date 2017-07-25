import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const state = {
  auth: {
    user: {
      username: null
    },
    isConfirmed: null,
    isAnon: true,
    isAuth: false
  }
}

// getters
const getters = {
  user: state => state.auth.user,
  isAnon: state => state.auth.isAnon,
  isConfirmed: state => state.auth.isConfirmed,
  isAuth: state => state.auth.isAuth
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
      commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
      commit(types.RECEIVE_AUTH, err.state)
    })
  },
  getCurrentUser({ commit }) {
    api.getCurrentUser().then(user => {
      console.log(JSON.stringify(user))
      commit(types.RECEIVE_AUTH, user)
    }).catch(err => {
      console.log(JSON.stringify(err))
    })
  },
  confirmCode({ commit }, code) {
    api.confirmCode(code).then(confirmed => {
      commit(types.RECEIVE_AUTH, { isConfirmed: confirmed })
    })
  },
  resendConfirmCode({ commit }, email) {
    api.resendConfirmCode(email).then(result => {
      commit(types.UPDATE_MESSAGE, { type: 'success', text: 'Confirmation Code Resent' })
      commit(types.RECEIVE_AUTH, { isConfirmed: false })
    })
  }
}

// mutations
const mutations = {
  [types.RECEIVE_AUTH](state, auth) {
    state.auth = { ...state.auth, ...auth }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
