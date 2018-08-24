<template>
  <div class="mycenter">
    <div class="user">
      <div class="avatar-wrap">
        <open-data type="userAvatarUrl" class="avatar"></open-data>
      </div>
      <div class="right">
        <open-data type="userNickName" class="nick"></open-data>
        <p class="userid">ID: {{uid}}</p>
      </div>
    </div>
    <div class="mycenter-bd">
      <div class="collect">
        <img src="./collect-icon.png" alt="" class="icon">
        <p class="text">我的收藏</p>
      </div>
      <p class="no-result" v-show="!collectList.length">暂无收藏</p>
      <scroll-view class="collect-list" scroll-y v-if="collectList.length">
        <listview :isPreview="isPreview"
                  :list="collectList"
                  :imageSrc="item.thumb"
                  :favorite="'1'"
                  :titleShow="titleShow"
                  @selectItem="selectItem"
                  @sendFriend="sendFriend"
                  @download="download"
                  @collect="collect"
                  @previewImage="previewImage"></listview>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Listview from 'components/listview'
import {favoriteList, favorite} from 'api/api'
export default {
  data() {
    return {
      // 是否预览表情
      isPreview: true,
      collectList: [],
      previewIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'auth',
      'uid',
      'item'
    ])
  },
  components: {
    Listview
  },
  methods: {
    // 预览
    selectItem(item, index) {
      this.previewIndex = index
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
                  mask: true,
                  duration: 3500,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },
    // 收藏 | 取消收藏
    collect() {
      wx.showLoading({
        mask: true
      })
      favorite(this.auth, this.item.id, 0).then((res) => {
        if(res.result === 1) {
          wx.showToast({
            title: '取消收藏',
            mask: true
          })
          this.collectList.splice(this.previewIndex, 1)
          if(!this.collectList.length) {
            return
          }
          this.setItem(this.collectList[0])
        }
      })
    },
    // 预览图片
    previewImage() {
      wx.previewImage({
        urls: new Array(this.item.thumb)
      })
    },
    _favoriteList() {
      favoriteList(this.auth).then((res) => {
        // console.log(res)
        if(res.result === 1) {
          this.collectList = res.data
          if(this.collectList.length) {
            this.setItem(this.collectList[0])
          }
        }
      })
    },
    ...mapActions([
      'setItem'
    ])
  },
  onShow() {
    this._favoriteList()
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
  .mycenter {
    height: 100%;
    display: flex;
    flex-direction: column;
    .user {
      width: 100%;
      height: 100px;
      background-color: #ec4318;
      display: flex;
      box-sizing: border-box;
      padding: 18px 20px;
      align-items: center;
      .avatar-wrap {
        width: 64px;
        height: 64px;
        overflow: hidden;
        border-radius: 50%;
        .avatar {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .right {
        margin-left: 15px;
        color: #fff;
        line-height: 1;
        .nick {
          font-size: 18px;
        }
        .userid {
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
    .mycenter-bd {
      flex: 1;
      position: relative;
      .no-result {
        font-size: 16px;
        color: #333;
        text-align: center;
        margin-top: 150px;
        font-weight: 700;
      }
      .collect {
        display: flex;
        align-items: center;
        padding:  15px 0 0 15px;
        .icon {
          width: 26px;
          height: 24px;
        }
        .text {
          flex: 1;
          font-size: 16px;
          color: #333;
          line-height: 1;
          margin-left: 8px;
        }
      }
      .collect-list {
        position: absolute;
        top: 41px;
        bottom: 0;
        background-color: #fff;
        width: 100%;
      }
    }
  }
</style>
