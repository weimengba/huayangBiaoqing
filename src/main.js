import Vue from 'vue'
import App from './App'
import Store from './store'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

Vue.prototype.$store = Store

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/home/main',
      'pages/mycenter/main',
      'pages/search/main',
      'pages/preview/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ec4318',
      navigationBarTitleText: '花样表情',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#999',
      selectedColor: '#333',
      backgroundColor: '#fff',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/home/main',
          text: '首页',
          iconPath: '/static/images/home.png',
          selectedIconPath: '/static/images/home-highlight.png'
        },
        {
          pagePath: 'pages/mycenter/main',
          text: '我的',
          iconPath: '/static/images/mycenter.png',
          selectedIconPath: '/static/images/mycenter-highlight.png'
        }
      ]
    }
  }
}
