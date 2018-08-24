<script>
import {login} from 'api/api'
import {mapActions} from 'vuex'
export default {
  created () {
    this.login()
  },
  methods: {
    login() {
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      const _this = this
      wx.login({
        success(res) {
          if(res.code) {
            // console.log(res.code)
            login(res.code).then((res) => {
              // console.log(res)
              _this.saveAuth(res.data.auth)
              _this.saveUid(res.data.uid)
            })
          }
        }
      })
    },
    ...mapActions([
      'saveAuth',
      'saveUid'
    ])
  }
}
</script>

<style>
  page {
    height: 100%;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
</style>
