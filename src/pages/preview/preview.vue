<template>
  <div class="preview">
    <scroll-view scroll-y class="scroll">
      <listview :isPreview="isPreview"
                :list="recommend"
                :imageSrc="item.thumb"
                :favorite="item.favorite"
                :titleShow="titleShow"
                @selectItem="selectItem"
                @sendFriend="sendFriend"
                @download="download"
                @collect="collect"
                @previewImage="previewImage"></listview>
    </scroll-view>
  </div>
</template>

<script>
import Listview from 'components/listview'
import {recommend, favorite} from 'api/api'
import {mapGetters, mapActions} from 'vuex'
export default {
  components: {
    Listview
  },
  data() {
    return {
      // 是否预览表情
      isPreview: true,
      titleShow: true,
      recommend: []
    }
  },
  computed: {
    ...mapGetters([
      'auth',
      'item'
    ])
  },
  methods: {
    // 预览
    selectItem(item) {
      this.setItem(item)
    },
    // 发送给好友
    sendFriend() {
      wx.showToast({
        title: '点击图片预览，长按图片发送给好友',
        icon: 'none',
        mask: true,
        duration: 3500
      })
    },
    // 下载
    download() {
      wx.showLoading({
        mask: true
      })
      wx.downloadFile({
        url: this.item.img,
        success(res) {
          if(res.statusCode === 200) {
            // console.log(res.tempFilePath)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                // console.log(result)
                wx.showToast({
                  title: `保存成功，请打开相册查看并使用`,
                  icon: 'none',
                  mask: true,
                  durantion: 3500
                })
              }
            })
          }
        }
      })
    },
    // 收藏
    collect() {
      wx.showLoading({
        mask: true
      })
      let status = this.item.favorite == 1 ? 0 : 1
      favorite(this.auth, this.item.id, status).then((res) => {
        if(res.result === 1) {
          if(status == 1) {
            wx.showToast({
              title: '收藏成功',
              mask: true
            })
          }else {
            wx.showToast({
              title: '取消收藏',
              mask: true
            })
          }
          this.$store.state.item.favorite = status
        }
      })
    },
    previewImage() {
      wx.previewImage({
        urls: new Array(this.item.thumb)
      })
    },
    _recommend() {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      recommend(this.auth, this.item.id).then((res) => {
        if(res.result === 1) {
          this.recommend = res.data
        }
        wx.hideLoading()
      })
    },
    ...mapActions([
      'setItem'
    ])
  },
  onLoad() {
    this.imageSrc = this.item.thumb
    this._recommend()
  },
  onShareAppMessage() {
    return {
      title: '聊天缺表情？快到这里来找！',
      path: '/pages/home/main',
      imageUrl: '/static/images/shareImage.png'
    }
  }
}
</script>

<style lang="less" scoped>
  .preview,
  .scroll {
    height: 100%;
  }
</style>
