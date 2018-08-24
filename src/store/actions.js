import * as types from './mutation-types'
import {saveSearch, clearSearch} from 'common/js/cache'

export const saveAuth = function({commit}, auth) {
  commit(types.SET_AUTH, auth)
}

export const saveUid = function({commit}, uid) {
  commit(types.SET_UID, uid)
}

export const setItem = function({commit}, item) {
  commit(types.SET_ITEM, item)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}