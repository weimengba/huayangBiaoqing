<template>
  <div class="search">
    <div class="search-wrap">
      <search-box ref="searchBox" @searchQuery="searchQuery" @query="onQueryChange"></search-box>
    </div>
    <scroll-view class="content" scroll-y @scrolltolower="searchMore">
      <div class="keywords" v-show="!query">
        <div class="list-wrap">
          <ul class="hot-list">
            <li class="item" v-for="(item, index) of keywords" :key="index" @click="addQuery(item)">{{item}}</li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <p class="title">历史记录</p>
          <ul class="history-ul">
            <li class="item" v-for="(item, index) of searchHistory" :key="index" @click="addQuery(item)">{{item}}</li>
          </ul>
        </div>
      </div>
      <div v-show="query && result.length">
        <listview :isPreview="isPreview"
                  :imageSrc="item.thumb"
                  :favorite="item.favorite"
                  :list="result"
                  @selectItem="selectItem"
                  @sendFriend="sendFriend"
                  @download="download"
                  @collect="collect"
                  @previewImage="previewImage">
        </listview>
      </div>
      <div class="no-result" v-show="!hasMore && !result.length">
        <img src="./noresult-icon.png" alt="" class="icon">
        <p class="text">抱歉没有搜索到您想要的试试其他关键词吧</p>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import Listview from 'components/listview'
import SearchBox from 'components/search-box'
import {mapGetters, mapActions} from 'vuex'
import {searchLog, search, favorite} from 'api/api'
export default {
  components: {
    Listview,
    SearchBox
  },
  data() {
    return {
      result: [],
      // 是否预览表情
      isPreview: true,
      keywords: [],
      page: 0,
      hasMore: true,
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'auth',
      'item'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    // 搜索
    searchQuery() {
      if(!this.query) {
        wx.showToast({
          title: '请输入搜索内容',
          icon: 'none'
        })
        return
      }
      this.saveSearchHistory(this.query)
      this._search()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
      this.query = query
      this.searchQuery(query)
    },
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
            console.log(res.tempFilePath)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                // console.log(result)
                wx.showToast({
                  title: `保存成功，请打开相册查看并使用`,
                  mask: true,
                  icon: 'none',
                  duration: 3500
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
    searchMore() {
      if(!this.hasMore) {
        return
      }
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.page ++
      search(this.auth, this.page, this.query).then((res) => {
        if(res.result === 1) {
          this.result = this.result.concat(res.data)
          this._checkMore(res.data)
        }
        wx.hideLoading()
      })
    },
    _searchLog() {
      searchLog(this.auth).then((res) => {
        if(res.result === 1) {
          this.keywords = res.data.push
        }
      })
    },
    _search() {
      this.result = []
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      this.hasMore = true
      search(this.auth, this.page, this.query).then((res) => {
        // console.log(res)
        if(res.result === 1) {
          this.result = res.data
          if(res.data.length) {
            this.setItem(res.data[0])
          }
          this._checkMore(res.data)
        }
        wx.hideLoading()
      })
    },
    _checkMore(data) {
      if(!data.length) {
        this.hasMore = false
      }
    },
    ...mapActions([
      'saveSearchHistory',
      'setItem'
    ])
  },
  onLoad() {
    this._searchLog()
  },
  mounted() {    
    this.$refs.searchBox.setQuery(null)
  },
  watch: {
    query(newVal) {
      if(!newVal) {
        this.hasMore = true
      }
    }
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
  .search-wrap {
    padding: 15px 15px 0;
  }
  .content {
    position: absolute;
    top: 65px;
    bottom: 0;
    background-color: #fff;
    .no-result {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      .icon {
        width: 165px;
        height: 159px;
        display: block;
        margin-bottom: 15px;
      }
      .text {
        width: 154px;
        font-size: 14px;
        color: #999;
        line-height: 20px;
        text-align: center;
        margin: 0 auto;
      }
    }
    .list-wrap {
      padding-bottom: 10px;
      background-color: #f5f5f5;
      .hot-list {
        width: 100%;
        padding: 0 15px 25px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        .item {
          font-size: 16px;
          color: #333;
          margin-right: 25px;
          margin-top: 15px;
          max-width: 80px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .search-history {
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      background-color: #fff;
      .title {
        font-size: 14px;
        color: #838383;
        line-height: 1;
        padding-top: 15px;
      }
      .history-ul {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          width: 49%;
          margin-top: 20px;
          font-size: 16px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
