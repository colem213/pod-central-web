import * as types from './mutation-types'
import api from '@/api'

export const subscribe = ({ commit, dispatch }, feedUrl) => {
  api.subscribe(feedUrl).then(({channelId}) => {
    dispatch('getChannel', channelId)
  }).catch(err => {
    commit(types.UPDATE_MESSAGE, { type: 'error', text: err.message })
  })
}
