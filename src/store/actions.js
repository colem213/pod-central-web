import * as types from './mutation-types'
import api from '@/api'

export const subscribe = ({ commit }, feedUrl) => {
  api.subscribe(feedUrl).then(({items, channel}) => {
    commit(types.RECEIVE_ITEMS, { items })
    commit(types.RECEIVE_CHANNELS, { channels: [channel] })
  }).catch(() => {})
}
