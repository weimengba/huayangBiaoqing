import * as types from './mutation-types'

const mutations = {
  [types.SET_AUTH](state, auth) {
    state.auth = auth
  },
  [types.SET_UID](state, uid) {
    state.uid = uid
  },
  [types.SET_ITEM](state, item) {
    state.item = item
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  }
}

export default mutations