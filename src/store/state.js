import {loadSearch} from 'common/js/cache'

const state = {
  auth: '',
  item: {},
  uid: '000000',
  searchHistory: loadSearch()
}

export default state