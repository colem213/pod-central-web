import api from '@/api'
import * as types from '@/store/mutation-types'

// initial state
const initialState = {
  user: {
    username: '',
    email: '',
    email_verified: null
  },
  isAnon: true,
  isAuth: false,
  showSignIn: false
}
const state = {
  auth: {
    ...initialState
  }
}

// getters
const getters = {
  user: state => state.auth.user,
  isAnon: state => state.auth.isAnon,
  isConfirmed: state => state.auth.user.email_verified,
  isAuth: state => state.auth.isAuth,
  showSignIn: state => state.auth.showSignIn
}

// actions
const actions = {
  signUp({ commit, dispatch }, form) {
    api.signUp(form).then(auth => {
      commit(types.RECEIVE_AUTH, auth)
    }).catch(err => {
      commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
    })
  },
  signIn({ commit }, form) {
    api.signIn(form).then(auth => {
      commit(types.RECEIVE_AUTH, { showSignIn: false, ...auth })
      commit(types.UPDATE_MESSAGE, { type: 'success', text: `Welcome, ${auth.user.given_name}!` })
    }).catch(err => {
      commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
      if (err.state) {
        commit(types.RECEIVE_AUTH, err.state)
      }
    })
  },
  signOut({ commit }) {
    api.signOut().then(() => {
      commit(types.RECEIVE_AUTH, { ...initialState })
      commit(types.UPDATE_MESSAGE, { type: 'success', text: 'You\'ve logged out!' })
    }).catch(() => {
      commit(types.UPDATE_MESSAGE, { type: 'error', text: 'There was a problem logging you out' })
    })
  },
  getCurrentUser({ commit }) {
    api.getCurrentUser().then(auth => {
      commit(types.RECEIVE_AUTH, auth)
    })
  },
  confirmCode({ commit }, code) {
    api.confirmCode(code).then(() => {
      commit(types.UPDATE_MESSAGE, { type: 'success', text: 'Successfully confirmed!' })
      commit(types.RECEIVE_AUTH, { isConfirmed: true, showSignIn: true })
    }).catch(err => {
      commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
    })
  },
  resendConfirmCode({ commit }, email) {
    api.resendConfirmCode(email).then(result => {
      commit(types.UPDATE_MESSAGE, { type: 'success', text: 'Confirmation Code Re-sent' })
    }).catch(err => {
      commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
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
